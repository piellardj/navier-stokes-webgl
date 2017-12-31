import Shader from "../gl-utils/shader";
import VBO from "../gl-utils/vbo";
import { ShaderSrc } from "./build-shaders";
import { encodingStr as encodingObstaclesStr } from "./obstacle-map-shaders";

const rawEncodingStr =
`const float MAX_SPEED = 1.0;
const float SPEED_BANDWIDTH = 2.01 * MAX_SPEED;

const float MIN_DIVERGENCE = -4.0 * MAX_SPEED;
const float MAX_DIVERGENCE =  4.0 * MAX_SPEED;
const float DIVERGENCE_BANDWIDTH = MAX_DIVERGENCE - MIN_DIVERGENCE;

const float MIN_PRESSURE = 0.5 * MIN_DIVERGENCE;
const float MAX_PRESSURE = 0.5 * MAX_DIVERGENCE;
const float PRESSURE_BANDWIDTH = MAX_PRESSURE - MIN_PRESSURE;

/* Decodes a float value (32 bits in [0,1])
 * from a 4D value (4x8bits in [0,1]x[0,1]x[0,1]x[0,1]) */
float decode32bit(vec4 v)
{
    const vec4 weights = 255.0 * vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0) / (256.0*256.0*256.0*256.0 - 1.0);
    return dot(weights, v);
}

/* Encodes a float value (32 bits in [0,1])
 * into a 4D value (4x8bits in [0,1]x[0,1]x[0,1]x[0,1]) */
vec4 encode32bit(float f)
{
    const vec4 base = (256.0*256.0*256.0*256.0 - 1.0) / vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);
    return floor(mod(f * base, 256.0)) / 255.0;
}

/* Decodes a float value (16 bits in [0,1])
 * from a 2D value (2x8bits in [0,1]x[0,1]) */
float decode16bit(vec2 v)
{
    const vec2 weights = 255.0 * vec2(256.0, 1.0) / (256.0*256.0 - 1.0);
    return dot(weights, v);
}

/* Encodes a float value (16 bits in [0,1])
 * into a 2D value (2x8bits in [0,1]x[0,1]) */
vec2 encode16bit(float f)
{
    const vec2 base = (256.0*256.0 - 1.0) / vec2(256.0, 1.0);
    return floor(mod(f * base, 256.0)) / 255.0;
}

float decodeDivergence(vec4 texel) {
    float div = decode32bit(texel);
    return div * DIVERGENCE_BANDWIDTH + MIN_DIVERGENCE;
}
vec4 encodeDivergence(float div) {
    div = (div - MIN_DIVERGENCE) / DIVERGENCE_BANDWIDTH;
    return encode32bit(div);
}

float decodePressure(vec4 texel) {
    float p = decode32bit(texel);
    return p * PRESSURE_BANDWIDTH + MIN_PRESSURE;
}
vec4 encodePressure(float p) {
    p = (p - MIN_PRESSURE) / PRESSURE_BANDWIDTH;
    return encode32bit(p);
}

___ENCODING_VELOCITY___

___ENCODING_OBSTACLES___`;

const encodingVelocityFloatStr =
`vec4 encodeVelocity(vec2 vel) {
    return vec4(vel, 0, 0);
}
vec2 decodeVelocity(vec4 texel) {
    return texel.rg;
}`;

const encodingVelocityNoFloatStr =
`vec4 encodeVelocity(vec2 vel) {
    vel = 0.5 * (vel / MAX_SPEED + 1.0);
    return vec4(encode16bit(vel.x), encode16bit(vel.y));
}
vec2 decodeVelocity(vec4 texel) {
    vec2 vel = vec2(decode16bit(texel.rg), decode16bit(texel.ba));
    return (2.0 * vel - 1.0) * MAX_SPEED;
}`;

const addVelVert =
`uniform vec2 uBrushSize; //relative, in [0,1]x[0,1]
uniform vec2 uBrushPos; //relative, in [0,1]x[0,1]

attribute vec2 aCorner; //{0,1}x{0,1}

varying vec2 sampleCoords;
varying vec2 toBrush;

void main(void) {
    sampleCoords = aCorner;
    toBrush = (uBrushPos - aCorner) / uBrushSize;

    gl_Position = vec4(2.0*aCorner - 1.0, 0.0, 1.0);
}`;

const addVelFrag =
`precision mediump float;

uniform sampler2D uVel;

uniform vec2 uAddVel;

varying vec2 sampleCoords;
varying vec2 toBrush;

___ENCODING___

void main(void) {
    vec2 vel = decodeVelocity(texture2D(uVel, sampleCoords));

    float influence = 1.0 - clamp(length(toBrush), 0.0, 1.0);
    vec2 toAdd = influence * uAddVel;

    vel += toAdd;
    vel *= min(1.0, MAX_SPEED / length(vel));

    gl_FragColor = encodeVelocity(vel);
}`;

const fullscreenVert =
`attribute vec2 aCorner; //{0,1}x{0,1}

varying vec2 sampleCoords;

void main(void) {
    sampleCoords = aCorner;
    gl_Position = vec4(2.0*aCorner - 1.0, 0.0, 1.0);
}`;

const advectFrag =
`precision mediump float;

uniform sampler2D uQuantity; //thing to advect
uniform sampler2D uVel;

uniform vec2 uVelUnit;
uniform float uDt;

varying vec2 sampleCoords;

___ENCODING___

void main(void) {
    vec2 vel = decodeVelocity(texture2D(uVel, sampleCoords));
    vec2 pos = sampleCoords - uDt * vel * uVelUnit;
    gl_FragColor = texture2D(uQuantity, pos);
}`;

const jacobiPressureFrag =
  `precision mediump float;

uniform sampler2D uPrevIter; //x
uniform sampler2D uConstantTerm; //b
uniform sampler2D uObstacles;

uniform float uAlpha;
uniform float uInvBeta;

uniform vec2 uTexelSize;

varying vec2 sampleCoords;

___ENCODING___

void main(void) {
    vec2 obstacle = decodeObstacle(texture2D(uObstacles, sampleCoords));
    vec2 coords = sampleCoords + uTexelSize * obstacle;

    float result = decodePressure(texture2D(uPrevIter, coords - vec2(uTexelSize.x,0))) +
                   decodePressure(texture2D(uPrevIter, coords + vec2(uTexelSize.x,0))) +
                   decodePressure(texture2D(uPrevIter, coords - vec2(0,uTexelSize.y))) +
                   decodePressure(texture2D(uPrevIter, coords + vec2(0,uTexelSize.y)));

    result += uAlpha * decodeDivergence(texture2D(uConstantTerm, coords));
    result *= uInvBeta;
    result = clamp(result, MIN_PRESSURE, MAX_PRESSURE);

    gl_FragColor = encodePressure(result);
}`;

const divergenceFrag =
  `precision mediump float;

uniform sampler2D uVelocity;

uniform vec2 uTexelSize;

varying vec2 sampleCoords;

___ENCODING___

void main(void) {
    vec2 top =    decodeVelocity(texture2D(uVelocity, sampleCoords + vec2(0,uTexelSize.y)));
    vec2 bottom = decodeVelocity(texture2D(uVelocity, sampleCoords - vec2(0,uTexelSize.y)));
    vec2 left =   decodeVelocity(texture2D(uVelocity, sampleCoords - vec2(uTexelSize.x,0)));
    vec2 right =  decodeVelocity(texture2D(uVelocity, sampleCoords + vec2(uTexelSize.x,0)));

    float div = ((right.x - left.x) + (top.y - bottom.y));
    div *= min(1.0, MAX_DIVERGENCE / length(div));

    gl_FragColor = encodeDivergence(div);
}`;

const substractGradientFrag =
  `precision mediump float;

uniform sampler2D uVelocities;
uniform sampler2D uPressure;

uniform vec2 uTexelSize;
uniform float uHalfInvDx;

varying vec2 sampleCoords;

___ENCODING___

void main(void) {
    float top =    decodePressure(texture2D(uPressure, sampleCoords + vec2(0,uTexelSize.y)));
    float bottom = decodePressure(texture2D(uPressure, sampleCoords - vec2(0,uTexelSize.y)));
    float left =   decodePressure(texture2D(uPressure, sampleCoords - vec2(uTexelSize.x,0)));
    float right =  decodePressure(texture2D(uPressure, sampleCoords + vec2(uTexelSize.x,0)));

    vec2 grad = uHalfInvDx * vec2(right - left, top - bottom);

    vec2 partialVel = decodeVelocity(texture2D(uVelocities, sampleCoords));
    vec2 divFreeVel = partialVel - grad;
    divFreeVel *= min(1.0, MAX_SPEED / length(divFreeVel));

    gl_FragColor = encodeVelocity(divFreeVel);
}`;

const obstacleVelocityFrag =
  `precision mediump float;

uniform sampler2D uVelocities;
uniform sampler2D uObstacles;

uniform vec2 uTexelSize;

varying vec2 sampleCoords;

___ENCODING___

void main(void) {
    vec2 obstacle = decodeObstacle(texture2D(uObstacles, sampleCoords));
    vec2 coords = sampleCoords + obstacle * uTexelSize;

    vec2 vel = decodeVelocity(texture2D(uVelocities, coords));
    vel *= sign(0.5 - dot(obstacle,obstacle));

    gl_FragColor = encodeVelocity(vel);
}`;

const drawVelocityFrag =
  `precision mediump float;

uniform sampler2D uVel;
uniform float uColorIntensity;
uniform bool uBlacknWhite;

varying vec2 sampleCoords;

___ENCODING___

/*
   /---\
__/     \__
 0 1 2 3 4
*/
float bump(float x) {
  return min(mix(0.0, 1.0, clamp(x, 0.0, 1.0)),
             mix(1.0, 0.0, clamp(x-3.0, 0.0, 1.0)));
}

/* Every hue, periodic with a period of 1 */
vec3 color(float value) {
    value *= 6.0;
    float r = bump(mod(value-4.0, 6.0));
    float g = bump(mod(value-0.0, 6.0));
    float b = bump(mod(value-2.0, 6.0));
    return vec3(r,g,b);
}

void main(void) {
    vec2 vel = decodeVelocity(texture2D(uVel, sampleCoords)) / MAX_SPEED;

    vec3 c = color(atan(vel.y, vel.x) / (2.0 * 3.14159));
    c = mix(c, vec3(1), float(uBlacknWhite));

    float intensity = smoothstep(0.0, 1.0, uColorIntensity*length(vel));

    gl_FragColor = vec4(intensity * c, 1);
}`;

const drawPressureFrag =
  `precision mediump float;

uniform sampler2D uPressure;
uniform float uColorIntensity;
uniform bool uBlacknWhite;

varying vec2 sampleCoords;

___ENCODING___

vec3 color(float value) {
    value = smoothstep(0.0, 1.0, clamp(value, 0.0, 1.0));
    value = smoothstep(0.0, 1.0, value);

    float r = smoothstep(.5, .75, value);
    float g = min(smoothstep(.0, .25, value),
                  1.0 - smoothstep(.75, 1.0, value));
    float b = 1.0 - smoothstep(.25, .5, value);
    return vec3(r,g,b);
}

void main(void) {
    float pressure = decodePressure(texture2D(uPressure, sampleCoords));
    pressure = pressure / MAX_PRESSURE;
    pressure = clamp(256.0*uColorIntensity*pressure, -.5, .5) + 0.5;

    vec3 c = color(pressure);
    c = mix(c, vec3(pressure), float(uBlacknWhite));

    gl_FragColor = vec4(c, 1);
}`;

let encodingStr: string = rawEncodingStr;
setUseFloatTextures(false);

function setUseFloatTextures(useFloat: boolean): void {
  const replace = (useFloat) ? encodingVelocityFloatStr : encodingVelocityNoFloatStr;
  encodingStr = rawEncodingStr.replace(/___ENCODING_VELOCITY___/g, replace);
  encodingStr = encodingStr.replace(/___ENCODING_OBSTACLES___/g, encodingObstaclesStr);
}

const drawVelocitySrc = new ShaderSrc(fullscreenVert, drawVelocityFrag);
const drawPressureSrc = new ShaderSrc(fullscreenVert, drawPressureFrag);
const addVelSrc = new ShaderSrc(addVelVert, addVelFrag);
const advectSrc = new ShaderSrc(fullscreenVert, advectFrag);
const jacobiPressureSrc = new ShaderSrc(fullscreenVert, jacobiPressureFrag);
const divergenceSrc = new ShaderSrc(fullscreenVert, divergenceFrag);
const substractGradientSrc = new ShaderSrc(fullscreenVert, substractGradientFrag);
const obstaclesVelocitySrc = new ShaderSrc(fullscreenVert, obstacleVelocityFrag);

function buildFullscreenShader(gl: WebGLRenderingContext, src: ShaderSrc): Shader {
  const vertSrc = src.vert;
  let fragSrc = src.frag.replace(/___ENCODING___/g, encodingStr);
  
  const shader = new Shader(gl, vertSrc, fragSrc);
  shader.a["aCorner"].VBO = VBO.createQuad(gl, 0, 0, 1, 1);
  return shader;
}

function buildDrawVelocityShader(gl: WebGLRenderingContext): Shader {
  return buildFullscreenShader(gl, drawVelocitySrc);
}

function buildDrawPressureShader(gl: WebGLRenderingContext): Shader {
  return buildFullscreenShader(gl, drawPressureSrc);
}

function buildAddVelShader(gl: WebGLRenderingContext): Shader {
  return buildFullscreenShader(gl, addVelSrc);
}

function buildAdvectShader(gl: WebGLRenderingContext): Shader {
  return buildFullscreenShader(gl, advectSrc);
}

function buildJacobiPressureShader(gl: WebGLRenderingContext): Shader {
  return buildFullscreenShader(gl, jacobiPressureSrc);
}

function buildDivergenceShader(gl: WebGLRenderingContext): Shader {
  return buildFullscreenShader(gl, divergenceSrc);
}

function buildSubstractGradientShader(gl: WebGLRenderingContext): Shader {
  return buildFullscreenShader(gl, substractGradientSrc);
}

function buildObstaclesVelocityShader(gl: WebGLRenderingContext): Shader {
  return buildFullscreenShader(gl, obstaclesVelocitySrc);
}

export {
  buildDrawVelocityShader,
  buildDrawPressureShader,
  buildAddVelShader,
  buildAdvectShader,
  buildJacobiPressureShader,
  buildDivergenceShader,
  buildSubstractGradientShader,
  buildObstaclesVelocityShader,
  setUseFloatTextures,
};