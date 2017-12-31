import GLResource from "./gl-resource";

class VBO extends GLResource {
  private id: WebGLBuffer;
  private size: number;
  private type: GLenum;
  private normalize: GLboolean;
  private stride: GLsizei;
  private offset: GLintptr;

  constructor(gl: WebGLRenderingContext, array: ArrayBufferView, size: number, type: GLenum) {
    super(gl);

    this.id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.size = size;
    this.type = type;
    this.normalize = false;
    this.stride = 0;
    this.offset = 0;
  }

  public freeGLResources(): void {
    this.gl.deleteBuffer(this.id);
    this.id = null;
  }

  public static createQuad(gl: WebGLRenderingContext, minX: number, minY: number, maxX: number, maxY: number): VBO {
    let vert = [
      minX, minY,
      maxX, minY,
      minX, maxY,
      maxX, maxY,
    ];

    return new VBO(gl, new Float32Array(vert), 2, gl.FLOAT);
  }

  public bind(location: GLuint): void {
    const gl = super.gl;

    gl.enableVertexAttribArray(location);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    gl.vertexAttribPointer(location, this.size, this.type, this.normalize, this.stride, this.offset);
  }
};

export default VBO;