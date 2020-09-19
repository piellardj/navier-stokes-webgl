import "./page-interface-generated";

function check(gl: WebGLRenderingContext): boolean {
  // const vertexUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
  // const fragmentUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
  // if (vertexUnits < 2 || fragmentUnits < 3) {
  // alert("Your device does not meet the requirements for this simulation.");
  // return false;
  // }

  function setError(message: string) {
    Page.Demopage.setErrorMessage("webgl-requirements", message);
  }

  const mediump = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT);
  if (mediump.precision < 23) {
    Page.Demopage.setErrorMessage("webgl-requirements", "Your device only supports low precision float in fragment shader.\n" +
      "The simulation will not run.");
    return false;
  }

  return true;
}

let allExtensionsLoaded: boolean = false;

function loadExtensions(gl: WebGLRenderingContext, extensions: string[]) {
  allExtensionsLoaded = true;

  let i = 0;
  for (let ext of extensions) {
    if (!gl.getExtension(ext)) {
      Page.Demopage.setErrorMessage("no-ext" + i, "Cannot load WebGL extension '" + ext + "'.");
      allExtensionsLoaded = false;
    }
    ++i;
  }
}


export { check, loadExtensions, allExtensionsLoaded };