import Shader from "../gl-utils/shader";
import VBO from "../gl-utils/vbo";
import { ShaderSrc } from "./build-shaders";

const drawVert =
  `uniform vec2 uBrushSize; //relative, in [0,1]x[0,1]
uniform vec2 uBrushPos; //relative, in [0,1]x[0,1]

attribute vec2 aCorner; //in {-1,+1}x{-1,+1}

varying vec2 toCenter;

void main(void) {
    toCenter = -aCorner;

    vec2 pos = uBrushPos + aCorner * uBrushSize;

    gl_Position = vec4(2.0 * pos - 1.0, 0, 1);
}`;

const drawFrag =
  `precision mediump float;

uniform float uThickness; //relative to brushRadius

varying vec2 toCenter;

void main(void) {
    float dist = length(toCenter);
    if (dist < 1.0-uThickness || dist > 1.0)
        discard;

    const vec3 color = vec3(1);

    gl_FragColor = vec4(color, 1.0);
}`;


const drawSrc = new ShaderSrc(drawVert, drawFrag);

function buildDrawShader(gl: WebGLRenderingContext): Shader {
  const shader = new Shader(gl, drawSrc.vert, drawSrc.frag);

  shader.a["aCorner"].VBO = VBO.createQuad(gl, -1, -1, +1, +1);
  return shader;
}

export { buildDrawShader };