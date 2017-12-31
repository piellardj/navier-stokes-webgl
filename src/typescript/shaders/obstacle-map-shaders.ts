import Shader from "../gl-utils/shader";
import VBO from "../gl-utils/vbo";
import { ShaderSrc, Replace } from "./build-shaders";

const encodingStr =
  `vec4 encodeObstacle(vec2 normal) {
  normal = clamp(normalize(normal), -1.0, 1.0);
  return vec4(0.5 * normal + 0.5, 0, 0);
}
vec2 decodeObstacle(vec4 texel) {
  return 2.0 * texel.rg - 1.0;
}`;

const drawVert =
  `attribute vec2 aCorner; //{0,1}x{0,1}

varying vec2 sampleCoords;

void main(void) {
    sampleCoords = aCorner;
    gl_Position = vec4(2.0*aCorner - 1.0, 0.0, 1.0);
}`;

const drawFrag =
  `precision mediump float;

uniform sampler2D uObstacles;

varying vec2 sampleCoords;

___ENCODING___

void main(void) {
    vec2 obstacle = decodeObstacle(texture2D(uObstacles, sampleCoords));
    if (dot(obstacle, obstacle) < 0.5)
        discard;

    gl_FragColor = vec4(0.5*obstacle + 0.5, 0, 0);
}`;

const addObstacleVert =
  `uniform vec2 uSize; //relative, in [0,1]x[0,1]
uniform vec2 uPos; //relative, in [0,1]x[0,1]

attribute vec2 aCorner; //in {-1,+1}x{-1,+1}

varying vec2 toCenter;

void main(void) {
    toCenter = -aCorner;

    vec2 pos = uPos + aCorner * uSize;

    gl_Position = vec4(2.0 * pos - 1.0, 0, 1);
}`;

const addObstacleFrag =
  `precision mediump float;

varying vec2 toCenter;

___ENCODING___

void main(void) {
    float dist = length(toCenter);
    if (dist > 1.0)
        discard;

    vec2 normal = -toCenter / dist;
    gl_FragColor = encodeObstacle(normal);
}`;


const includes: Replace[] = [
  { toReplace: "___ENCODING___", replacement: encodingStr },
];

const drawSrc = new ShaderSrc(drawVert, drawFrag);
drawSrc.batchReplace(includes);

const addSrc = new ShaderSrc(addObstacleVert, addObstacleFrag);
addSrc.batchReplace(includes);


function buildDrawShader(gl: WebGLRenderingContext): Shader {
  const shader = new Shader(gl, drawSrc.vert, drawSrc.frag);
  shader.a["aCorner"].VBO = VBO.createQuad(gl, 0, 0, 1, 1);
  return shader;
}

function buildAddShader(gl: WebGLRenderingContext): Shader {
  const shader = new Shader(gl, addSrc.vert, addSrc.frag);
  shader.a["aCorner"].VBO = VBO.createQuad(gl, -1, -1, 1, 1);
  return shader;
}

export { buildDrawShader, buildAddShader, encodingStr };