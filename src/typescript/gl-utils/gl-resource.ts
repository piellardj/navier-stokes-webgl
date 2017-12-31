abstract class GLResource {
  private _gl: WebGLRenderingContext;

  constructor(gl: WebGLRenderingContext) {
    this._gl = gl;
  }
  
  public get gl(): WebGLRenderingContext {
    return this._gl;
  }
  public abstract freeGLResources(): void;
}

export default GLResource;