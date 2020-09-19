function resizeCanvas(gl: WebGLRenderingContext, hidpi: boolean = false): void {
    const cssPixel: number = (hidpi) ? window.devicePixelRatio : 1;
    const canvas = gl.canvas as HTMLCanvasElement;

    const width: number = Math.floor(canvas.clientWidth * cssPixel);
    const height: number = Math.floor(canvas.clientHeight * cssPixel);
    if (canvas.width != width || canvas.height != height) {
        canvas.width = width;
        canvas.height = height;
    }
}

export { resizeCanvas };