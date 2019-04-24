import GLResource from "./gl-resource";


class FBO extends GLResource {
    id: WebGLFramebuffer;
    width: number;
    height: number;

    constructor(gl: WebGLRenderingContext, width: number, height: number) {
        super(gl);
        
        this.id = gl.createFramebuffer();
        this.width = width;
        this.height = height;
    }

    public bind(colorBuffers: WebGLTexture[], depthBuffer: WebGLRenderbuffer = null): void {
        const gl = super.gl();

        gl.bindFramebuffer(gl.FRAMEBUFFER, this.id);
        gl.viewport(0, 0, this.width, this.height);
      
        for (let i = 0; i < colorBuffers.length; ++i) {
          gl.framebufferTexture2D(
            gl.FRAMEBUFFER, gl['COLOR_ATTACHMENT' + i], gl.TEXTURE_2D, colorBuffers[i], 0);
        }
        
        if (depthBuffer) {
          gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
          gl.framebufferRenderbuffer(
            gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
        }
    }

    public static bindDefault(gl: WebGLRenderingContext): void {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }

    public freeGLResources(): void {
        super.gl().deleteFramebuffer(this.id);
        this.id = null;
    }
}

export default FBO;