import GLResource from "./gl-resource";
import VBO from "./vbo";

function notImplemented(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: any): void {
  alert("NOT IMPLEMENTED YET");
}

function bindUniformFloat(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number): void;
function bindUniformFloat(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number[]): void;
function bindUniformFloat(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: any): void {
  if (Array.isArray(value)) {
    gl.uniform1fv(location, value);
  } else {
    gl.uniform1f(location, value);
  }
}

function bindUniformFloat2v(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number[]): void {
  gl.uniform2fv(location, value);
}

function bindUniformFloat3v(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number[]): void {
  gl.uniform3fv(location, value);
}

function bindUniformFloat4v(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number[]): void {
  gl.uniform4fv(location, value);
}

function bindUniformInt(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number): void;
function bindUniformInt(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number[]): void;
function bindUniformInt(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: any): void {
  if (Array.isArray(value)) {
    gl.uniform1iv(location, value);
  } else {
    gl.uniform1iv(location, value);
  }
}

function bindUniformInt2v(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number[]): void {
  gl.uniform2iv(location, value);
}

function bindUniformInt3v(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number[]): void {
  gl.uniform3iv(location, value);
}

function bindUniformInt4v(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number[]): void {
  gl.uniform4iv(location, value);
}

function bindUniformBool(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: boolean | number): void {
  gl.uniform1i(location, +value);
}

function bindUniformBool2v(gl: WebGLRenderingContext, location: WebGLUniformLocation, value): void {
  gl.uniform2iv(location, value);
}

function bindUniformBool3v(gl: WebGLRenderingContext, location: WebGLUniformLocation, value): void {
  gl.uniform3iv(location, value);
}

function bindUniformBool4v(gl: WebGLRenderingContext, location: WebGLUniformLocation, value): void {
  gl.uniform4iv(location, value);
}

function bindUniformFloatMat2(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number[]): void {
  gl.uniformMatrix2fv(location, false, value);
}

function bindUniformFloatMat3(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number[]): void {
  gl.uniformMatrix3fv(location, false, value);
}

function bindUniformFloatMat4(gl: WebGLRenderingContext, location: WebGLUniformLocation, value: number[]): void {
  gl.uniformMatrix4fv(location, false, value);
}

function bindSampler2D(gl: WebGLRenderingContext, location: WebGLUniformLocation, unitNb: number, value: WebGLTexture): void {
  gl.uniform1i(location, unitNb);
  gl.activeTexture(gl['TEXTURE' + unitNb]);
  gl.bindTexture(gl.TEXTURE_2D, value);
}

function bindSamplerCube(gl: WebGLRenderingContext, location: WebGLUniformLocation, unitNb: number, value: WebGLTexture): void {
  gl.uniform1i(location, unitNb);
  gl.activeTexture(gl['TEXTURE' + unitNb]);
  gl.bindTexture(gl.TEXTURE_CUBE_MAP, value);
}

interface Type {
  str: string;
  binder;//: (gl: WebGLRenderingContext, location: WebGLUniformLocation, value: any) => void;// |
  //((gl: WebGLRenderingContext, location: WebGLUniformLocation, unitNb: number, value: WebGLTexture) => void);
};

/* From WebGL spec:
* http://www.khronos.org/registry/webgl/specs/latest/1.0/#5.14 */
const types = {
  0x8B50: { str: 'FLOAT_VEC2', binder: bindUniformFloat2v },
  0x8B51: { str: 'FLOAT_VEC3', binder: bindUniformFloat3v },
  0x8B52: { str: 'FLOAT_VEC4', binder: bindUniformFloat4v },
  0x8B53: { str: 'INT_VEC2', binder: bindUniformInt2v },
  0x8B54: { str: 'INT_VEC3', binder: bindUniformInt3v },
  0x8B55: { str: 'INT_VEC4', binder: bindUniformInt4v },
  0x8B56: { str: 'BOOL', binder: bindUniformBool },
  0x8B57: { str: 'BOOL_VEC2', binder: bindUniformBool2v },
  0x8B58: { str: 'BOOL_VEC3', binder: bindUniformBool3v },
  0x8B59: { str: 'BOOL_VEC4', binder: bindUniformBool4v },
  0x8B5A: { str: 'FLOAT_MAT2', binder: bindUniformFloatMat2 },
  0x8B5B: { str: 'FLOAT_MAT3', binder: bindUniformFloatMat3 },
  0x8B5C: { str: 'FLOAT_MAT4', binder: bindUniformFloatMat4 },
  0x8B5E: { str: 'SAMPLER_2D', binder: bindSampler2D },
  0x8B60: { str: 'SAMPLER_CUBE', binder: bindSamplerCube },
  0x1400: { str: 'BYTE', binder: notImplemented },
  0x1401: { str: 'UNSIGNED_BYTE', binder: notImplemented },
  0x1402: { str: 'SHORT', binder: notImplemented },
  0x1403: { str: 'UNSIGNED_SHORT', binder: notImplemented },
  0x1404: { str: 'INT', binder: bindUniformInt },
  0x1405: { str: 'UNSIGNED_INT', binder: notImplemented },
  0x1406: { str: 'FLOAT', binder: bindUniformFloat }
};

interface ShaderUniform {
  value: boolean | boolean[] | number | number[] | WebGLTexture | WebGLTexture[];
  loc: WebGLUniformLocation;
  size: number;
  type: number;
}

interface ShaderAttribute {
  VBO: VBO;
  loc: GLint;
  size: number;
  type: number;
}

class ShaderProgram extends GLResource {
  id: WebGLProgram;
  uCount: number;
  u: ShaderUniform[];

  aCount: number;
  a: ShaderAttribute[];

  constructor(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
    function createShader(type: GLenum, source: string): WebGLShader {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (!success) {
        console.log(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    }

    super(gl);

    this.id = null;
    this.uCount = 0;
    this.aCount = 0;

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);

    const id = gl.createProgram();
    gl.attachShader(id, vertexShader);
    gl.attachShader(id, fragmentShader);
    gl.linkProgram(id);

    const success = gl.getProgramParameter(id, gl.LINK_STATUS);
    if (!success) {
      console.log(gl.getProgramInfoLog(id));
      gl.deleteProgram(id);
    } else {
      this.id = id;

      this.introspection();
    }
  }

  public freeGLResources(): void {
    super.gl.deleteProgram(this.id);
    this.id = null;
  }

  private introspection(): void {
    const gl = super.gl;

    this.uCount = gl.getProgramParameter(this.id, gl.ACTIVE_UNIFORMS);
    this.u = [];
    for (let i = 0; i < this.uCount; ++i) {
      const uniform = gl.getActiveUniform(this.id, i);
      const name = uniform.name;

      this.u[name] = {
        value: null,
        loc: gl.getUniformLocation(this.id, name),
        size: uniform.size,
        type: uniform.type,
      };
    }

    this.aCount = gl.getProgramParameter(this.id, gl.ACTIVE_ATTRIBUTES);
    this.a = [];
    for (let i = 0; i < this.aCount; ++i) {
      const attribute = gl.getActiveAttrib(this.id, i);
      const name = attribute.name;

      this.a[name] = {
        VBO: null,
        loc: gl.getAttribLocation(this.id, name),
        size: attribute.size,
        type: attribute.type,
      };
    }
  }

  public use(): void {
    super.gl.useProgram(this.id);
  }

  public bindUniforms(): void {
    const gl: WebGLRenderingContext = super.gl;
    let currTextureUnitNb: number = 0;

    for (let uName in this.u) {
      const uniform = this.u[uName];
      if (uniform.value !== null) {
        if (uniform.type === 0x8B5E || uniform.type === 0x8B60) {
          const unitNb: number = currTextureUnitNb;
          types[uniform.type].binder(gl, uniform.loc, unitNb, uniform.value);
          currTextureUnitNb++;
        } else {
          types[uniform.type].binder(gl, uniform.loc, uniform.value);
        }
      }
    }
  }

  public bindAttributes(): void {
    for (let aName in this.a) {
      const attribute = this.a[aName];
      if (attribute.VBO !== null) {
        attribute.VBO.bind(attribute.loc);
      }
    }
  }

  public bindUniformsAndAttributes(): void {
    this.bindUniforms();
    this.bindAttributes();
  }
}

export default ShaderProgram;