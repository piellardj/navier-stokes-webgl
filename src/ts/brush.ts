import GLResource from "./gl-utils/gl-resource";
import Shader from "./gl-utils/shader";
import * as Parameters from "./parameters";
import * as BrushShaders from "./shaders/brush-shaders";

class Brush extends GLResource {
    public thickness: number;

    private _drawShader: Shader;

    constructor(gl: WebGLRenderingContext) {
        super(gl);
        this._drawShader = BrushShaders.buildDrawShader(gl);

        this.thickness = 2;
    }

    public freeGLResources(): void {
        this._drawShader.freeGLResources();
    }

    public draw(): void {
        const gl = super.gl();
        const canvasSize = [gl.canvas.clientWidth, gl.canvas.clientHeight];
        const drawShader = this._drawShader;
        drawShader.use();

        const brushSize = [
            Parameters.brush.radius / canvasSize[0],
            Parameters.brush.radius / canvasSize[1]
        ];
        drawShader.u["uBrushSize"].value = brushSize;
        drawShader.u["uBrushPos"].value = Parameters.mouse.pos;
        drawShader.u["uThickness"].value = this.thickness / Parameters.brush.radius;
        drawShader.bindUniformsAndAttributes();

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}

export default Brush;