import GLResource from "./gl-utils/gl-resource";
import Shader from "./gl-utils/shader";
import FBO from "./gl-utils/fbo";
import ObstacleMap from "./obstacle-map";
import * as Parameters from "./parameters";
import * as FluidShaders from "./shaders/fluid-shaders";

import "./page-interface-generated";

class Fluid extends GLResource {
  private _width: number;
  private _height: number;
  private _FBO: FBO;
  private _velTextures: WebGLTexture[];
  private _tmpTexture: WebGLTexture;
  private _pressureTexture: WebGLTexture;
  private _divergenceTexture: WebGLTexture;
  private _currIndex: number;
  private _nbIterations: number;
  private _useFloatTextures: boolean;

  private _drawVelocityShader: Shader;
  private _drawPressureShader: Shader;
  private _addVelShader: Shader;
  private _advectShader: Shader;
  private _jacobiPressureShader: Shader;
  private _divergenceShader: Shader;
  private _substractGradientShader: Shader;
  private _obstaclesVelocityShader: Shader;

  public viscosity: number;
  public dx: number;
  public timestep: number;
  public colorIntensity: number;
  public color: boolean;

  constructor(gl: WebGLRenderingContext, width: number, height: number) {
    super(gl);

    this._useFloatTextures = false;
    this.viscosity = 0.0002;
    this.colorIntensity = 0.033;
    this.color = true;

    this.reset(width, height);
  }

  public freeGLResources(): void {
    if (this._FBO) {
      this._FBO.freeGLResources();
    }

    this.freeTextures();
    this.freeShaders();
  }

  private freeTextures(): void {
    const gl = super.gl();

    if (this._velTextures) {
      gl.deleteTexture(this._velTextures[0]);
      gl.deleteTexture(this._velTextures[1]);
    }
    gl.deleteTexture(this._tmpTexture);
    gl.deleteTexture(this._pressureTexture);
    gl.deleteTexture(this._divergenceTexture);
  }

  private freeShaders(): void {
    function freeShader(shader: Shader): void {
      if (shader) {
        shader.freeGLResources();
      }
    }

    freeShader(this._drawVelocityShader);
    freeShader(this._drawPressureShader);
    freeShader(this._addVelShader);
    freeShader(this._advectShader);
    freeShader(this._jacobiPressureShader);
    freeShader(this._divergenceShader);
    freeShader(this._substractGradientShader);
    freeShader(this._obstaclesVelocityShader);
  }

  public reset(width: number, height: number): void {
    this.freeGLResources();

    this._width = width;
    this._height = height;
    this.dx = 1 / Math.min(width, height);

    this._FBO = new FBO(super.gl(), width, height);

    this.initTextures();
    this.buildShaders();

    this._currIndex = 0;
  }

  public set useFloatTextures(bool: boolean) {
    if (bool !== this._useFloatTextures) {
      this._useFloatTextures = bool;
      this.reset(this._width, this._height);
    }
  }

  public set minNbIterations(value: number) {
    this._nbIterations = 2 * Math.ceil(value / 2) + 1;
  }

  public get texelSize(): number[] {
    return [1 / this._width, 1 / this._height];
  }

  public get velTexture(): WebGLTexture {
    return this._velTextures[this.currIndex];
  }

  public update(obstacleMap: ObstacleMap): void {
    const gl = super.gl();
    const dt = this.timestep;

    gl.clearColor(0.5, 0, 0.5, 0);

    if (Page.Canvas.isMouseDown()) {
      const canvas = gl.canvas as HTMLCanvasElement;
      const canvasSize = [canvas.clientWidth, canvas.clientHeight];
      const brushSize = [
        Parameters.brush.radius / canvasSize[0],
        Parameters.brush.radius / canvasSize[1]
      ];
      const pos = Parameters.mouse.pos;
      const vel = [
        Parameters.mouse.movement[0] * Parameters.brush.strength,
        Parameters.mouse.movement[1] * Parameters.brush.strength,
      ];
      this.addVel(pos, brushSize, vel);
    }

    this.advect(dt);

    this.obstaclesVelocity(obstacleMap);

    this.project(obstacleMap);

    this.obstaclesVelocity(obstacleMap);
  }

  public addVel(pos: number[], size: number[], vel: number[]): void {
    const gl = this.gl();
    const addVelShader = this._addVelShader;
    addVelShader.u["uVel"].value = this._velTextures[this.currIndex];
    addVelShader.u["uBrushPos"].value = pos;
    addVelShader.u["uBrushSize"].value = size;
    addVelShader.u["uAddVel"].value = vel;

    addVelShader.use();

    this._FBO.bind([this._velTextures[this.nextIndex]]);
    addVelShader.bindUniformsAndAttributes();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    this.switchBuffers();
  }

  public drawVelocity(): void {
    const gl = this.gl();
    const drawShader = this._drawVelocityShader;
    drawShader.u["uVel"].value = this._velTextures[this.currIndex];
    drawShader.u["uColorIntensity"].value = this.colorIntensity;
    drawShader.u["uBlacknWhite"].value = !this.color;

    drawShader.use();
    drawShader.bindUniformsAndAttributes();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  public drawPressure(): void {
    const gl = this.gl();
    const drawPressureShader = this._drawPressureShader;
    drawPressureShader.u["uPressure"].value = this._pressureTexture;
    drawPressureShader.u["uColorIntensity"].value = this.colorIntensity;
    drawPressureShader.u["uBlacknWhite"].value = !this.color;

    drawPressureShader.use();
    drawPressureShader.bindUniformsAndAttributes();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private get currIndex(): number {
    return this._currIndex;
  }

  private get nextIndex(): number {
    return (this._currIndex + 1) % 2;
  }

  private switchBuffers(): void {
    this._currIndex = this.nextIndex;
  }

  private obstaclesVelocity(obstacleMap: ObstacleMap): void {
    const gl = this.gl();
    const obstacleVelocityShader = this._obstaclesVelocityShader;

    obstacleVelocityShader.u["uVelocities"].value = this._velTextures[this.currIndex];
    obstacleVelocityShader.u["uObstacles"].value = obstacleMap.texture;
    obstacleVelocityShader.u["uTexelSize"].value = this.texelSize;

    this._FBO.bind([this._velTextures[this.nextIndex]]);

    obstacleVelocityShader.use();
    obstacleVelocityShader.bindUniformsAndAttributes();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    this.switchBuffers();
  }

  private advect(dt: number): void {
    const gl = this.gl();
    const advectShader = this._advectShader;

    advectShader.u["uVelUnit"].value = [128 / this._width, 128 / this._height];
    advectShader.u["uDt"].value = dt;
    advectShader.u["uQuantity"].value = this._velTextures[this.currIndex];
    advectShader.u["uVel"].value = this._velTextures[this.currIndex];

    this._FBO.bind([this._velTextures[this.nextIndex]]);

    advectShader.use();
    advectShader.bindUniformsAndAttributes();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    this.switchBuffers();
  }

  private computeDivergence(): void {
    const gl = this.gl();
    const divergenceShader = this._divergenceShader

    divergenceShader.u["uTexelSize"].value = this.texelSize;
    divergenceShader.u["uVelocity"].value = this._velTextures[this.currIndex];

    this._FBO.bind([this._divergenceTexture]);
    gl.clear(gl.COLOR_BUFFER_BIT);

    divergenceShader.use();
    divergenceShader.bindUniformsAndAttributes();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private computePressure(obstacleMap: ObstacleMap): void {
    const gl = this.gl();
    const jacobiPressureShader = this._jacobiPressureShader
    const alpha = -.5 * this.dx;
    const beta = 4;
    const dst = this._pressureTexture;
    const cstTerm = this._divergenceTexture;

    jacobiPressureShader.u["uTexelSize"].value = this.texelSize;
    jacobiPressureShader.u["uAlpha"].value = alpha;
    jacobiPressureShader.u["uInvBeta"].value = 1 / beta;
    jacobiPressureShader.u["uConstantTerm"].value = cstTerm;
    jacobiPressureShader.u["uObstacles"].value = obstacleMap.texture;

    let index = 0;
    let textures = [this._tmpTexture, dst];
    this._FBO.bind([this._tmpTexture]);
    gl.clear(gl.COLOR_BUFFER_BIT);

    jacobiPressureShader.use();
    jacobiPressureShader.bindAttributes();
    for (let i = 0; i < this._nbIterations; ++i) { //nb iterations must be odd
      jacobiPressureShader.u["uPrevIter"].value = textures[index];

      this._FBO.bind([textures[(index + 1) % 2]]);
      jacobiPressureShader.bindUniforms();
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      index = (index + 1) % 2;
    }
  }

  private substractPressureGradient(): void {
    const gl = this.gl();
    const substractGradientShader = this._substractGradientShader;
    substractGradientShader.u["uVelocities"].value = this._velTextures[this.currIndex];
    substractGradientShader.u["uPressure"].value = this._pressureTexture;
    substractGradientShader.u["uTexelSize"].value = this.texelSize;
    substractGradientShader.u["uHalfInvDx"].value = 0.5 / this.dx;

    this._FBO.bind([this._velTextures[this.nextIndex]]);
    substractGradientShader.use();
    substractGradientShader.bindUniformsAndAttributes();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    this.switchBuffers();
  }

  private project(obstacleMap: ObstacleMap): void {
    this.computeDivergence();
    this.computePressure(obstacleMap);
    this.substractPressureGradient();
  }

  private initTextures(): void {
    this.freeTextures();
    const gl = super.gl();
    const width = this._width;
    const height = this._height;

    let floatTexels: number[] = [];
    for (let i = 0; i < 4 * width * height; ++i) {
      floatTexels.push(0);
    }
    const floatData = new Float32Array(floatTexels);

    let uintTexels: number[] = [];
    for (let i = 0; i < 4 * width * height; ++i) {
      uintTexels.push(127);
    }
    const uintData = new Uint8Array(uintTexels);

    const velFormat = (this._useFloatTextures) ? gl.FLOAT : gl.UNSIGNED_BYTE;
    const velData = (this._useFloatTextures) ? floatData : uintData;

    let textures: WebGLTexture[] = [];
    for (let i = 0; i < 2; ++i) {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
        gl.RGBA, velFormat, velData);
      textures.push(texture);
    }

    for (let i = 0; i < 3; ++i) {
      let texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, uintData);
      textures.push(texture);
    }

    for (let texture of textures) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);

    this._velTextures = [textures[0], textures[1]];
    this._tmpTexture = textures[2];
    this._pressureTexture = textures[3];
    this._divergenceTexture = textures[4];
  }

  private buildShaders(): void {
    this.freeShaders();
    FluidShaders.setUseFloatTextures(this._useFloatTextures);
    const gl = super.gl();

    this._drawVelocityShader = FluidShaders.buildDrawVelocityShader(gl);
    this._drawPressureShader = FluidShaders.buildDrawPressureShader(gl);
    this._addVelShader = FluidShaders.buildAddVelShader(gl);
    this._advectShader = FluidShaders.buildAdvectShader(gl);
    this._jacobiPressureShader = FluidShaders.buildJacobiPressureShader(gl);
    this._divergenceShader = FluidShaders.buildDivergenceShader(gl);
    this._substractGradientShader = FluidShaders.buildSubstractGradientShader(gl);
    this._obstaclesVelocityShader = FluidShaders.buildObstaclesVelocityShader(gl);
  }
}

export default Fluid;