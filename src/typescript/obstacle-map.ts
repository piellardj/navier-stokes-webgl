import GLResource from "./gl-utils/gl-resource";
import Shader from "./gl-utils/shader";
import VBO from "./gl-utils/vbo";
import FBO from "./gl-utils/fbo";
import * as ObstacleMapShaders from "./shaders/obstacle-map-shaders";

class ObstacleMap extends GLResource {
  private _width: number;
  private _height: number;

  private _fbo: FBO;
  private _texture: WebGLTexture;
  private _initTexture: WebGLTexture;

  private _drawShader: Shader;
  private _addShader: Shader;

  constructor(gl: WebGLRenderingContext, width: number, height: number) {
    super(gl);

    this._width = width;
    this._height = height;

    this._fbo = new FBO(gl, width, height);

    this._drawShader = ObstacleMapShaders.buildDrawShader(gl);
    this._addShader = ObstacleMapShaders.buildAddShader(gl);

    this.initObstaclesMap();
  }

  public freeGLResources(): void {
    const gl = super.gl;

    this._fbo.freeGLResources();
    this._fbo = null;
    
    gl.deleteTexture(this._texture);
    gl.deleteTexture(this._initTexture);

    this._drawShader.freeGLResources();
    this._addShader.freeGLResources();
    this._drawShader = null;
    this._addShader = null;
  }

  public get texture(): WebGLTexture {
    return this._texture;
  }

  public draw(): void {
    const gl = super.gl;
    const drawShader = this._drawShader;

    drawShader.u["uObstacles"].value = this.texture;
    drawShader.use();
    drawShader.bindUniformsAndAttributes();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  public addObstacle(pos, size): void {
    const gl = super.gl;
    const addShader = this._addShader;
    addShader.u["uSize"].value = pos;
    addShader.u["uPos"].value = size;

    this._fbo.bind([this._texture]);
    addShader.use();
    addShader.bindUniformsAndAttributes();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  private initObstaclesMap(): void {
    const gl = super.gl;
    const width = this._width;
    const height = this._height;

    let texels: number[] = [];
    for (let iY = 0; iY < height; ++iY) {
      for (let iX = 0; iX < width; ++iX) {
        if (iY === 0) {
          texels.push.apply(texels, [127, 255, 0, 255]);
        } else if (iY === height - 1) {
          texels.push.apply(texels, [127, 0, 0, 255]);
        } else if (iX === 0) {
          texels.push.apply(texels, [255, 127, 0, 255]);
        } else if (iX === width - 1) {
          texels.push.apply(texels, [0, 127, 0, 255]);
        } else {
          texels.push.apply(texels, [127, 127, 0, 255]);
        }
      }
    }
    const data = new Uint8Array(texels);

    const textures: WebGLTexture[] = [];
    for (let i = 0; i < 2; ++i) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, data);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      textures.push(tex);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);

    this._texture = textures[0];
    this._initTexture = textures[1];
  }
}

export default ObstacleMap;