/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ts/brush.ts":
/*!*************************!*\
  !*** ./src/ts/brush.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-utils/gl-resource */ "./src/ts/gl-utils/gl-resource.ts"));
var Parameters = __importStar(__webpack_require__(/*! ./parameters */ "./src/ts/parameters.ts"));
var BrushShaders = __importStar(__webpack_require__(/*! ./shaders/brush-shaders */ "./src/ts/shaders/brush-shaders.ts"));
var Brush = (function (_super) {
    __extends(Brush, _super);
    function Brush(gl) {
        var _this = _super.call(this, gl) || this;
        _this._drawShader = BrushShaders.buildDrawShader(gl);
        _this.thickness = 2;
        return _this;
    }
    Brush.prototype.freeGLResources = function () {
        this._drawShader.freeGLResources();
    };
    Brush.prototype.draw = function () {
        var gl = _super.prototype.gl.call(this);
        var canvasSize = [gl.canvas.clientWidth, gl.canvas.clientHeight];
        var drawShader = this._drawShader;
        drawShader.use();
        var brushSize = [
            Parameters.brush.radius / canvasSize[0],
            Parameters.brush.radius / canvasSize[1]
        ];
        drawShader.u["uBrushSize"].value = brushSize;
        drawShader.u["uBrushPos"].value = Parameters.mouse.pos;
        drawShader.u["uThickness"].value = this.thickness / Parameters.brush.radius;
        drawShader.bindUniformsAndAttributes();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    return Brush;
}(gl_resource_1.default));
exports.default = Brush;


/***/ }),

/***/ "./src/ts/fluid.ts":
/*!*************************!*\
  !*** ./src/ts/fluid.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-utils/gl-resource */ "./src/ts/gl-utils/gl-resource.ts"));
var fbo_1 = __importDefault(__webpack_require__(/*! ./gl-utils/fbo */ "./src/ts/gl-utils/fbo.ts"));
var Parameters = __importStar(__webpack_require__(/*! ./parameters */ "./src/ts/parameters.ts"));
var FluidShaders = __importStar(__webpack_require__(/*! ./shaders/fluid-shaders */ "./src/ts/shaders/fluid-shaders.ts"));
var Fluid = (function (_super) {
    __extends(Fluid, _super);
    function Fluid(gl, width, height) {
        var _this = _super.call(this, gl) || this;
        _this._useFloatTextures = false;
        _this.viscosity = 0.0002;
        _this.colorIntensity = 0.033;
        _this.color = true;
        _this.reset(width, height);
        return _this;
    }
    Fluid.prototype.freeGLResources = function () {
        if (this._FBO) {
            this._FBO.freeGLResources();
        }
        this.freeTextures();
        this.freeShaders();
    };
    Fluid.prototype.freeTextures = function () {
        var gl = _super.prototype.gl.call(this);
        if (this._velTextures) {
            gl.deleteTexture(this._velTextures[0]);
            gl.deleteTexture(this._velTextures[1]);
        }
        gl.deleteTexture(this._tmpTexture);
        gl.deleteTexture(this._pressureTexture);
        gl.deleteTexture(this._divergenceTexture);
    };
    Fluid.prototype.freeShaders = function () {
        function freeShader(shader) {
            if (shader) {
                shader.freeGLResources();
            }
        }
        freeShader(this._drawVelocityShader);
        freeShader(this._drawPressureShader);
        freeShader(this._addVelShader);
        freeShader(this._advectShader);
        freeShader(this._jacobiPressureShader);
        freeShader(this._divergenceShader);
        freeShader(this._substractGradientShader);
        freeShader(this._obstaclesVelocityShader);
    };
    Fluid.prototype.reset = function (width, height) {
        this.freeGLResources();
        this._width = width;
        this._height = height;
        this.dx = 1 / Math.min(width, height);
        this._FBO = new fbo_1.default(_super.prototype.gl.call(this), width, height);
        this.initTextures();
        this.buildShaders();
        this._currIndex = 0;
    };
    Object.defineProperty(Fluid.prototype, "useFloatTextures", {
        set: function (bool) {
            if (bool !== this._useFloatTextures) {
                this._useFloatTextures = bool;
                this.reset(this._width, this._height);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Fluid.prototype, "minNbIterations", {
        set: function (value) {
            this._nbIterations = 2 * Math.ceil(value / 2) + 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Fluid.prototype, "texelSize", {
        get: function () {
            return [1 / this._width, 1 / this._height];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Fluid.prototype, "velTexture", {
        get: function () {
            return this._velTextures[this.currIndex];
        },
        enumerable: true,
        configurable: true
    });
    Fluid.prototype.update = function (obstacleMap) {
        var gl = _super.prototype.gl.call(this);
        var dt = this.timestep;
        gl.clearColor(0.5, 0, 0.5, 0);
        if (Canvas.isMouseDown()) {
            var canvasSize = [gl.canvas.clientWidth, gl.canvas.clientHeight];
            var brushSize = [
                Parameters.brush.radius / canvasSize[0],
                Parameters.brush.radius / canvasSize[1]
            ];
            var pos = Parameters.mouse.pos;
            var vel = [
                Parameters.mouse.movement[0] * Parameters.brush.strength,
                Parameters.mouse.movement[1] * Parameters.brush.strength,
            ];
            this.addVel(pos, brushSize, vel);
        }
        this.advect(dt);
        this.obstaclesVelocity(obstacleMap);
        this.project(obstacleMap);
        this.obstaclesVelocity(obstacleMap);
    };
    Fluid.prototype.addVel = function (pos, size, vel) {
        var gl = this.gl();
        var addVelShader = this._addVelShader;
        addVelShader.u["uVel"].value = this._velTextures[this.currIndex];
        addVelShader.u["uBrushPos"].value = pos;
        addVelShader.u["uBrushSize"].value = size;
        addVelShader.u["uAddVel"].value = vel;
        addVelShader.use();
        this._FBO.bind([this._velTextures[this.nextIndex]]);
        addVelShader.bindUniformsAndAttributes();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        this.switchBuffers();
    };
    Fluid.prototype.drawVelocity = function () {
        var gl = this.gl();
        var drawShader = this._drawVelocityShader;
        drawShader.u["uVel"].value = this._velTextures[this.currIndex];
        drawShader.u["uColorIntensity"].value = this.colorIntensity;
        drawShader.u["uBlacknWhite"].value = !this.color;
        drawShader.use();
        drawShader.bindUniformsAndAttributes();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    Fluid.prototype.drawPressure = function () {
        var gl = this.gl();
        var drawPressureShader = this._drawPressureShader;
        drawPressureShader.u["uPressure"].value = this._pressureTexture;
        drawPressureShader.u["uColorIntensity"].value = this.colorIntensity;
        drawPressureShader.u["uBlacknWhite"].value = !this.color;
        drawPressureShader.use();
        drawPressureShader.bindUniformsAndAttributes();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    Object.defineProperty(Fluid.prototype, "currIndex", {
        get: function () {
            return this._currIndex;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Fluid.prototype, "nextIndex", {
        get: function () {
            return (this._currIndex + 1) % 2;
        },
        enumerable: true,
        configurable: true
    });
    Fluid.prototype.switchBuffers = function () {
        this._currIndex = this.nextIndex;
    };
    Fluid.prototype.obstaclesVelocity = function (obstacleMap) {
        var gl = this.gl();
        var obstacleVelocityShader = this._obstaclesVelocityShader;
        obstacleVelocityShader.u["uVelocities"].value = this._velTextures[this.currIndex];
        obstacleVelocityShader.u["uObstacles"].value = obstacleMap.texture;
        obstacleVelocityShader.u["uTexelSize"].value = this.texelSize;
        this._FBO.bind([this._velTextures[this.nextIndex]]);
        obstacleVelocityShader.use();
        obstacleVelocityShader.bindUniformsAndAttributes();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        this.switchBuffers();
    };
    Fluid.prototype.advect = function (dt) {
        var gl = this.gl();
        var advectShader = this._advectShader;
        advectShader.u["uVelUnit"].value = [128 / this._width, 128 / this._height];
        advectShader.u["uDt"].value = dt;
        advectShader.u["uQuantity"].value = this._velTextures[this.currIndex];
        advectShader.u["uVel"].value = this._velTextures[this.currIndex];
        this._FBO.bind([this._velTextures[this.nextIndex]]);
        advectShader.use();
        advectShader.bindUniformsAndAttributes();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        this.switchBuffers();
    };
    Fluid.prototype.computeDivergence = function () {
        var gl = this.gl();
        var divergenceShader = this._divergenceShader;
        divergenceShader.u["uTexelSize"].value = this.texelSize;
        divergenceShader.u["uVelocity"].value = this._velTextures[this.currIndex];
        this._FBO.bind([this._divergenceTexture]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        divergenceShader.use();
        divergenceShader.bindUniformsAndAttributes();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    Fluid.prototype.computePressure = function (obstacleMap) {
        var gl = this.gl();
        var jacobiPressureShader = this._jacobiPressureShader;
        var alpha = -.5 * this.dx;
        var beta = 4;
        var dst = this._pressureTexture;
        var cstTerm = this._divergenceTexture;
        jacobiPressureShader.u["uTexelSize"].value = this.texelSize;
        jacobiPressureShader.u["uAlpha"].value = alpha;
        jacobiPressureShader.u["uInvBeta"].value = 1 / beta;
        jacobiPressureShader.u["uConstantTerm"].value = cstTerm;
        jacobiPressureShader.u["uObstacles"].value = obstacleMap.texture;
        var index = 0;
        var textures = [this._tmpTexture, dst];
        this._FBO.bind([this._tmpTexture]);
        gl.clear(gl.COLOR_BUFFER_BIT);
        jacobiPressureShader.use();
        jacobiPressureShader.bindAttributes();
        for (var i = 0; i < this._nbIterations; ++i) {
            jacobiPressureShader.u["uPrevIter"].value = textures[index];
            this._FBO.bind([textures[(index + 1) % 2]]);
            jacobiPressureShader.bindUniforms();
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            index = (index + 1) % 2;
        }
    };
    Fluid.prototype.substractPressureGradient = function () {
        var gl = this.gl();
        var substractGradientShader = this._substractGradientShader;
        substractGradientShader.u["uVelocities"].value = this._velTextures[this.currIndex];
        substractGradientShader.u["uPressure"].value = this._pressureTexture;
        substractGradientShader.u["uTexelSize"].value = this.texelSize;
        substractGradientShader.u["uHalfInvDx"].value = 0.5 / this.dx;
        this._FBO.bind([this._velTextures[this.nextIndex]]);
        substractGradientShader.use();
        substractGradientShader.bindUniformsAndAttributes();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        this.switchBuffers();
    };
    Fluid.prototype.project = function (obstacleMap) {
        this.computeDivergence();
        this.computePressure(obstacleMap);
        this.substractPressureGradient();
    };
    Fluid.prototype.initTextures = function () {
        this.freeTextures();
        var gl = _super.prototype.gl.call(this);
        var width = this._width;
        var height = this._height;
        var floatTexels = [];
        for (var i = 0; i < 4 * width * height; ++i) {
            floatTexels.push(0);
        }
        var floatData = new Float32Array(floatTexels);
        var uintTexels = [];
        for (var i = 0; i < 4 * width * height; ++i) {
            uintTexels.push(127);
        }
        var uintData = new Uint8Array(uintTexels);
        var velFormat = (this._useFloatTextures) ? gl.FLOAT : gl.UNSIGNED_BYTE;
        var velData = (this._useFloatTextures) ? floatData : uintData;
        var textures = [];
        for (var i = 0; i < 2; ++i) {
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, velFormat, velData);
            textures.push(texture);
        }
        for (var i = 0; i < 3; ++i) {
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, uintData);
            textures.push(texture);
        }
        for (var _i = 0, textures_1 = textures; _i < textures_1.length; _i++) {
            var texture = textures_1[_i];
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
        this._velTextures = [textures[0], textures[1]];
        this._tmpTexture = textures[2];
        this._pressureTexture = textures[3];
        this._divergenceTexture = textures[4];
    };
    Fluid.prototype.buildShaders = function () {
        this.freeShaders();
        FluidShaders.setUseFloatTextures(this._useFloatTextures);
        var gl = _super.prototype.gl.call(this);
        this._drawVelocityShader = FluidShaders.buildDrawVelocityShader(gl);
        this._drawPressureShader = FluidShaders.buildDrawPressureShader(gl);
        this._addVelShader = FluidShaders.buildAddVelShader(gl);
        this._advectShader = FluidShaders.buildAdvectShader(gl);
        this._jacobiPressureShader = FluidShaders.buildJacobiPressureShader(gl);
        this._divergenceShader = FluidShaders.buildDivergenceShader(gl);
        this._substractGradientShader = FluidShaders.buildSubstractGradientShader(gl);
        this._obstaclesVelocityShader = FluidShaders.buildObstaclesVelocityShader(gl);
    };
    return Fluid;
}(gl_resource_1.default));
exports.default = Fluid;


/***/ }),

/***/ "./src/ts/gl-utils/fbo.ts":
/*!********************************!*\
  !*** ./src/ts/gl-utils/fbo.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-resource */ "./src/ts/gl-utils/gl-resource.ts"));
var FBO = (function (_super) {
    __extends(FBO, _super);
    function FBO(gl, width, height) {
        var _this = _super.call(this, gl) || this;
        _this.id = gl.createFramebuffer();
        _this.width = width;
        _this.height = height;
        return _this;
    }
    FBO.prototype.bind = function (colorBuffers, depthBuffer) {
        if (depthBuffer === void 0) { depthBuffer = null; }
        var gl = _super.prototype.gl.call(this);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.id);
        gl.viewport(0, 0, this.width, this.height);
        for (var i = 0; i < colorBuffers.length; ++i) {
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl['COLOR_ATTACHMENT' + i], gl.TEXTURE_2D, colorBuffers[i], 0);
        }
        if (depthBuffer) {
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);
        }
    };
    FBO.bindDefault = function (gl) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    FBO.prototype.freeGLResources = function () {
        _super.prototype.gl.call(this).deleteFramebuffer(this.id);
        this.id = null;
    };
    return FBO;
}(gl_resource_1.default));
exports.default = FBO;


/***/ }),

/***/ "./src/ts/gl-utils/gl-resource.ts":
/*!****************************************!*\
  !*** ./src/ts/gl-utils/gl-resource.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GLResource = (function () {
    function GLResource(gl) {
        this._gl = gl;
    }
    GLResource.prototype.gl = function () {
        return this._gl;
    };
    return GLResource;
}());
exports.default = GLResource;


/***/ }),

/***/ "./src/ts/gl-utils/shader.ts":
/*!***********************************!*\
  !*** ./src/ts/gl-utils/shader.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-resource */ "./src/ts/gl-utils/gl-resource.ts"));
function notImplemented(gl, location, value) {
    alert("NOT IMPLEMENTED YET");
}
function bindUniformFloat(gl, location, value) {
    if (Array.isArray(value)) {
        gl.uniform1fv(location, value);
    }
    else {
        gl.uniform1f(location, value);
    }
}
function bindUniformFloat2v(gl, location, value) {
    gl.uniform2fv(location, value);
}
function bindUniformFloat3v(gl, location, value) {
    gl.uniform3fv(location, value);
}
function bindUniformFloat4v(gl, location, value) {
    gl.uniform4fv(location, value);
}
function bindUniformInt(gl, location, value) {
    if (Array.isArray(value)) {
        gl.uniform1iv(location, value);
    }
    else {
        gl.uniform1iv(location, value);
    }
}
function bindUniformInt2v(gl, location, value) {
    gl.uniform2iv(location, value);
}
function bindUniformInt3v(gl, location, value) {
    gl.uniform3iv(location, value);
}
function bindUniformInt4v(gl, location, value) {
    gl.uniform4iv(location, value);
}
function bindUniformBool(gl, location, value) {
    gl.uniform1i(location, +value);
}
function bindUniformBool2v(gl, location, value) {
    gl.uniform2iv(location, value);
}
function bindUniformBool3v(gl, location, value) {
    gl.uniform3iv(location, value);
}
function bindUniformBool4v(gl, location, value) {
    gl.uniform4iv(location, value);
}
function bindUniformFloatMat2(gl, location, value) {
    gl.uniformMatrix2fv(location, false, value);
}
function bindUniformFloatMat3(gl, location, value) {
    gl.uniformMatrix3fv(location, false, value);
}
function bindUniformFloatMat4(gl, location, value) {
    gl.uniformMatrix4fv(location, false, value);
}
function bindSampler2D(gl, location, unitNb, value) {
    gl.uniform1i(location, unitNb);
    gl.activeTexture(gl['TEXTURE' + unitNb]);
    gl.bindTexture(gl.TEXTURE_2D, value);
}
function bindSamplerCube(gl, location, unitNb, value) {
    gl.uniform1i(location, unitNb);
    gl.activeTexture(gl['TEXTURE' + unitNb]);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, value);
}
;
var types = {
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
var ShaderProgram = (function (_super) {
    __extends(ShaderProgram, _super);
    function ShaderProgram(gl, vertexSource, fragmentSource) {
        var _this = this;
        function createShader(type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!success) {
                console.log(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }
        _this = _super.call(this, gl) || this;
        _this.id = null;
        _this.uCount = 0;
        _this.aCount = 0;
        var vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
        var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
        var id = gl.createProgram();
        gl.attachShader(id, vertexShader);
        gl.attachShader(id, fragmentShader);
        gl.linkProgram(id);
        var success = gl.getProgramParameter(id, gl.LINK_STATUS);
        if (!success) {
            console.log(gl.getProgramInfoLog(id));
            gl.deleteProgram(id);
        }
        else {
            _this.id = id;
            _this.introspection();
        }
        return _this;
    }
    ShaderProgram.prototype.freeGLResources = function () {
        _super.prototype.gl.call(this).deleteProgram(this.id);
        this.id = null;
    };
    ShaderProgram.prototype.introspection = function () {
        var gl = _super.prototype.gl.call(this);
        this.uCount = gl.getProgramParameter(this.id, gl.ACTIVE_UNIFORMS);
        this.u = [];
        for (var i = 0; i < this.uCount; ++i) {
            var uniform = gl.getActiveUniform(this.id, i);
            var name_1 = uniform.name;
            this.u[name_1] = {
                value: null,
                loc: gl.getUniformLocation(this.id, name_1),
                size: uniform.size,
                type: uniform.type,
            };
        }
        this.aCount = gl.getProgramParameter(this.id, gl.ACTIVE_ATTRIBUTES);
        this.a = [];
        for (var i = 0; i < this.aCount; ++i) {
            var attribute = gl.getActiveAttrib(this.id, i);
            var name_2 = attribute.name;
            this.a[name_2] = {
                VBO: null,
                loc: gl.getAttribLocation(this.id, name_2),
                size: attribute.size,
                type: attribute.type,
            };
        }
    };
    ShaderProgram.prototype.use = function () {
        _super.prototype.gl.call(this).useProgram(this.id);
    };
    ShaderProgram.prototype.bindUniforms = function () {
        var gl = _super.prototype.gl.call(this);
        var currTextureUnitNb = 0;
        for (var uName in this.u) {
            var uniform = this.u[uName];
            if (uniform.value !== null) {
                if (uniform.type === 0x8B5E || uniform.type === 0x8B60) {
                    var unitNb = currTextureUnitNb;
                    types[uniform.type].binder(gl, uniform.loc, unitNb, uniform.value);
                    currTextureUnitNb++;
                }
                else {
                    types[uniform.type].binder(gl, uniform.loc, uniform.value);
                }
            }
        }
    };
    ShaderProgram.prototype.bindAttributes = function () {
        for (var aName in this.a) {
            var attribute = this.a[aName];
            if (attribute.VBO !== null) {
                attribute.VBO.bind(attribute.loc);
            }
        }
    };
    ShaderProgram.prototype.bindUniformsAndAttributes = function () {
        this.bindUniforms();
        this.bindAttributes();
    };
    return ShaderProgram;
}(gl_resource_1.default));
exports.default = ShaderProgram;


/***/ }),

/***/ "./src/ts/gl-utils/utils.ts":
/*!**********************************!*\
  !*** ./src/ts/gl-utils/utils.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function resizeCanvas(gl, hidpi) {
    if (hidpi === void 0) { hidpi = false; }
    var cssPixel = (hidpi) ? window.devicePixelRatio : 1;
    var width = Math.floor(gl.canvas.clientWidth * cssPixel);
    var height = Math.floor(gl.canvas.clientHeight * cssPixel);
    if (gl.canvas.width != width || gl.canvas.height != height) {
        gl.canvas.width = width;
        gl.canvas.height = height;
    }
}
exports.resizeCanvas = resizeCanvas;


/***/ }),

/***/ "./src/ts/gl-utils/vbo.ts":
/*!********************************!*\
  !*** ./src/ts/gl-utils/vbo.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-resource */ "./src/ts/gl-utils/gl-resource.ts"));
var VBO = (function (_super) {
    __extends(VBO, _super);
    function VBO(gl, array, size, type) {
        var _this = _super.call(this, gl) || this;
        _this.id = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, _this.id);
        gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        _this.size = size;
        _this.type = type;
        _this.normalize = false;
        _this.stride = 0;
        _this.offset = 0;
        return _this;
    }
    VBO.prototype.freeGLResources = function () {
        this.gl().deleteBuffer(this.id);
        this.id = null;
    };
    VBO.createQuad = function (gl, minX, minY, maxX, maxY) {
        var vert = [
            minX, minY,
            maxX, minY,
            minX, maxY,
            maxX, maxY,
        ];
        return new VBO(gl, new Float32Array(vert), 2, gl.FLOAT);
    };
    VBO.prototype.bind = function (location) {
        var gl = _super.prototype.gl.call(this);
        gl.enableVertexAttribArray(location);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
        gl.vertexAttribPointer(location, this.size, this.type, this.normalize, this.stride, this.offset);
    };
    return VBO;
}(gl_resource_1.default));
;
exports.default = VBO;


/***/ }),

/***/ "./src/ts/main.ts":
/*!************************!*\
  !*** ./src/ts/main.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Utils = __importStar(__webpack_require__(/*! ./gl-utils/utils */ "./src/ts/gl-utils/utils.ts"));
var fbo_1 = __importDefault(__webpack_require__(/*! ./gl-utils/fbo */ "./src/ts/gl-utils/fbo.ts"));
var Parameters = __importStar(__webpack_require__(/*! ./parameters */ "./src/ts/parameters.ts"));
var brush_1 = __importDefault(__webpack_require__(/*! ./brush */ "./src/ts/brush.ts"));
var obstacle_map_1 = __importDefault(__webpack_require__(/*! ./obstacle-map */ "./src/ts/obstacle-map.ts"));
var fluid_1 = __importDefault(__webpack_require__(/*! ./fluid */ "./src/ts/fluid.ts"));
var Requirements = __importStar(__webpack_require__(/*! ./requirements */ "./src/ts/requirements.ts"));
function initGL(canvas, flags) {
    function setError(message) {
        Demopage.setErrorMessage("webgl-support", message);
    }
    var gl = canvas.getContext("webgl", flags);
    if (!gl) {
        gl = canvas.getContext("experimental-webgl", flags);
        if (!gl) {
            setError("Your browser or device does not seem to support WebGL.");
            return null;
        }
        setError("Your browser or device only supports experimental WebGL.\n" +
            "The simulation may not run as expected.");
    }
    if (gl) {
        canvas.style.cursor = "none";
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.BLEND);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        Utils.resizeCanvas(gl, false);
    }
    return gl;
}
function main() {
    var canvas = Canvas.getCanvas();
    var gl = initGL(canvas, { alpha: false });
    if (!gl || !Requirements.check(gl))
        return;
    var extensions = [
        "OES_texture_float",
        "WEBGL_color_buffer_float",
        "OES_texture_float_linear",
    ];
    Requirements.loadExtensions(gl, extensions);
    var size = 256;
    var fluid = new fluid_1.default(gl, size, size);
    var brush = new brush_1.default(gl);
    var obstacleMaps = [];
    obstacleMaps["none"] = new obstacle_map_1.default(gl, size, size);
    obstacleMaps["one"] = new obstacle_map_1.default(gl, size, size);
    {
        obstacleMaps["one"].addObstacle([0.015, 0.015], [0.3, 0.5]);
    }
    obstacleMaps["many"] = new obstacle_map_1.default(gl, size, size);
    {
        var size_1 = [0.012, 0.012];
        for (var iX = 0; iX < 5; ++iX) {
            for (var iY = -iX / 2; iY <= iX / 2; ++iY) {
                size_1 = [size_1[0] + 0.0005, size_1[1] + 0.0005];
                var pos = [0.3 + iX * 0.07, 0.5 + iY * 0.08];
                obstacleMaps["many"].addObstacle(size_1, pos);
            }
        }
    }
    Parameters.bind(fluid);
    var instantFPS = 0;
    var updateFpsText = function () {
        Canvas.setIndicatorText("fps", instantFPS.toFixed(0));
    };
    setInterval(updateFpsText, 1000);
    var lastUpdate = 0;
    function mainLoop(time) {
        time *= 0.001;
        var dt = time - lastUpdate;
        instantFPS = 1 / dt;
        lastUpdate = time;
        dt = Math.min(dt, 1 / 10);
        var obstacleMap = obstacleMaps[Parameters.obstacles];
        if (Parameters.fluid.stream) {
            fluid.addVel([0.1, 0.5], [0.05, 0.2], [0.4, 0]);
        }
        fluid.update(obstacleMap);
        fbo_1.default.bindDefault(gl);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        if (Parameters.display.velocity) {
            fluid.drawVelocity();
        }
        else if (Parameters.display.pressure) {
            fluid.drawPressure();
        }
        if (Parameters.display.brush) {
            brush.draw();
        }
        if (Parameters.display.obstacles) {
            obstacleMap.draw();
        }
        if (Parameters.display.velocity && Parameters.display.pressure) {
            gl.viewport(10, 10, 128, 128);
            fluid.drawPressure();
        }
        requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop);
}
main();


/***/ }),

/***/ "./src/ts/obstacle-map.ts":
/*!********************************!*\
  !*** ./src/ts/obstacle-map.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var gl_resource_1 = __importDefault(__webpack_require__(/*! ./gl-utils/gl-resource */ "./src/ts/gl-utils/gl-resource.ts"));
var fbo_1 = __importDefault(__webpack_require__(/*! ./gl-utils/fbo */ "./src/ts/gl-utils/fbo.ts"));
var ObstacleMapShaders = __importStar(__webpack_require__(/*! ./shaders/obstacle-map-shaders */ "./src/ts/shaders/obstacle-map-shaders.ts"));
var ObstacleMap = (function (_super) {
    __extends(ObstacleMap, _super);
    function ObstacleMap(gl, width, height) {
        var _this = _super.call(this, gl) || this;
        _this._width = width;
        _this._height = height;
        _this._fbo = new fbo_1.default(gl, width, height);
        _this._drawShader = ObstacleMapShaders.buildDrawShader(gl);
        _this._addShader = ObstacleMapShaders.buildAddShader(gl);
        _this.initObstaclesMap();
        return _this;
    }
    ObstacleMap.prototype.freeGLResources = function () {
        var gl = _super.prototype.gl.call(this);
        this._fbo.freeGLResources();
        this._fbo = null;
        gl.deleteTexture(this._texture);
        gl.deleteTexture(this._initTexture);
        this._drawShader.freeGLResources();
        this._addShader.freeGLResources();
        this._drawShader = null;
        this._addShader = null;
    };
    Object.defineProperty(ObstacleMap.prototype, "texture", {
        get: function () {
            return this._texture;
        },
        enumerable: true,
        configurable: true
    });
    ObstacleMap.prototype.draw = function () {
        var gl = _super.prototype.gl.call(this);
        var drawShader = this._drawShader;
        drawShader.u["uObstacles"].value = this.texture;
        drawShader.use();
        drawShader.bindUniformsAndAttributes();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    ObstacleMap.prototype.addObstacle = function (pos, size) {
        var gl = _super.prototype.gl.call(this);
        var addShader = this._addShader;
        addShader.u["uSize"].value = pos;
        addShader.u["uPos"].value = size;
        this._fbo.bind([this._texture]);
        addShader.use();
        addShader.bindUniformsAndAttributes();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    ObstacleMap.prototype.initObstaclesMap = function () {
        var gl = _super.prototype.gl.call(this);
        var width = this._width;
        var height = this._height;
        var texels = [];
        for (var iY = 0; iY < height; ++iY) {
            for (var iX = 0; iX < width; ++iX) {
                if (iY === 0) {
                    texels.push.apply(texels, [127, 255, 0, 255]);
                }
                else if (iY === height - 1) {
                    texels.push.apply(texels, [127, 0, 0, 255]);
                }
                else if (iX === 0) {
                    texels.push.apply(texels, [255, 127, 0, 255]);
                }
                else if (iX === width - 1) {
                    texels.push.apply(texels, [0, 127, 0, 255]);
                }
                else {
                    texels.push.apply(texels, [127, 127, 0, 255]);
                }
            }
        }
        var data = new Uint8Array(texels);
        var textures = [];
        for (var i = 0; i < 2; ++i) {
            var tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            textures.push(tex);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
        this._texture = textures[0];
        this._initTexture = textures[1];
    };
    return ObstacleMap;
}(gl_resource_1.default));
exports.default = ObstacleMap;


/***/ }),

/***/ "./src/ts/parameters.ts":
/*!******************************!*\
  !*** ./src/ts/parameters.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Requirements = __importStar(__webpack_require__(/*! ./requirements */ "./src/ts/requirements.ts"));
var Mouse = (function () {
    function Mouse() {
        var _this = this;
        this._posInPx = [0, 0];
        this._pivotInPx = [0, 0];
        this.setPosInPx([0, 0]);
        this.setMovementInPx([0, 0]);
        Canvas.Observers.mouseMove.push(function (relX, relY) {
            var canvasSize = Canvas.getSize();
            _this.setPosInPx([canvasSize[0] * relX, canvasSize[1] * (1 - relY)]);
        });
        Canvas.Observers.mouseDown.push(function (relX, relY) {
            _this.setMovementInPx([0, 0]);
            _this._pivotInPx = _this._posInPx;
        });
    }
    Object.defineProperty(Mouse.prototype, "posInPx", {
        get: function () {
            return this._posInPx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mouse.prototype, "pos", {
        get: function () {
            return this._pos;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mouse.prototype, "movementInPx", {
        get: function () {
            return this._movementInPx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mouse.prototype, "movement", {
        get: function () {
            return this._movement;
        },
        enumerable: true,
        configurable: true
    });
    Mouse.prototype.setPosInPx = function (pos) {
        var toPivot = [
            this._pivotInPx[0] - pos[0],
            this._pivotInPx[1] - pos[1]
        ];
        var distToPivot = Math.sqrt(toPivot[0] * toPivot[0] + toPivot[1] * toPivot[1]);
        var maxDist = 16;
        if (distToPivot > maxDist) {
            toPivot[0] *= maxDist / distToPivot;
            toPivot[1] *= maxDist / distToPivot;
            this._pivotInPx[0] = pos[0] + toPivot[0];
            this._pivotInPx[1] = pos[1] + toPivot[1];
        }
        var movementInPx = [-toPivot[0] / maxDist, -toPivot[1] / maxDist];
        this.setMovementInPx(movementInPx);
        this._posInPx = pos;
        this._pos = this.setRelative(pos);
    };
    Mouse.prototype.setMovementInPx = function (movement) {
        this._movementInPx = movement;
        this._movement = this.setRelative(movement);
    };
    Mouse.prototype.setRelative = function (pos) {
        var canvasSize = Canvas.getSize();
        return [
            pos[0] / canvasSize[0],
            pos[1] / canvasSize[1],
        ];
    };
    return Mouse;
}());
var mouse = new Mouse();
exports.mouse = mouse;
function bindMouse() {
    exports.mouse = mouse = new Mouse();
}
var brushInfo = {
    radius: 10,
    strength: 100,
};
exports.brush = brushInfo;
var fluidInfo = {
    stream: true,
};
exports.fluid = fluidInfo;
var ObstaclesInfo;
(function (ObstaclesInfo) {
    ObstaclesInfo["NONE"] = "none";
    ObstaclesInfo["ONE"] = "one";
    ObstaclesInfo["MANY"] = "many";
})(ObstaclesInfo || (ObstaclesInfo = {}));
var obstaclesInfo = ObstaclesInfo.NONE;
exports.obstacles = obstaclesInfo;
var displayInfo = {
    velocity: true,
    pressure: true,
    brush: true,
    obstacles: true,
};
exports.display = displayInfo;
function bindControls(fluid) {
    {
        var RESOLUTIONS_CONTROL_ID = "resolution";
        var updateResolution = function (values) {
            var size = +values[0];
            fluid.reset(size, size);
        };
        Tabs.addObserver(RESOLUTIONS_CONTROL_ID, updateResolution);
        updateResolution(Tabs.getValues(RESOLUTIONS_CONTROL_ID));
    }
    {
        var FLOAT_CONTROL_ID = "float-texture-checkbox-id";
        if (!Requirements.allExtensionsLoaded) {
            Controls.setVisibility(FLOAT_CONTROL_ID, false);
            Checkbox.setChecked(FLOAT_CONTROL_ID, false);
        }
        var updateFloat = function (use) { fluid.useFloatTextures = use; };
        Checkbox.addObserver(FLOAT_CONTROL_ID, updateFloat);
        updateFloat(Checkbox.isChecked(FLOAT_CONTROL_ID));
    }
    {
        var ITERATIONS_CONTROL_ID = "solver-steps-range-id";
        var updateIterations = function (iterations) { fluid.minNbIterations = iterations; };
        Range.addObserver(ITERATIONS_CONTROL_ID, updateIterations);
        updateIterations(Range.getValue(ITERATIONS_CONTROL_ID));
    }
    {
        var TIMESTEP_CONTROL_ID = "timestep-range-id";
        var updateTimestep = function (timestep) { fluid.timestep = timestep; };
        Range.addObserver(TIMESTEP_CONTROL_ID, updateTimestep);
        updateTimestep(Range.getValue(TIMESTEP_CONTROL_ID));
    }
    {
        var STREAM_CONTROL_ID = "stream-checkbox-id";
        var updateStream = function (doStream) { fluidInfo.stream = doStream; };
        Checkbox.addObserver(STREAM_CONTROL_ID, updateStream);
        updateStream(Checkbox.isChecked(STREAM_CONTROL_ID));
    }
    {
        var OBSTACLES_CONTROL_ID = "obstacles";
        var updateObstacles = function (values) {
            exports.obstacles = obstaclesInfo = values[0];
        };
        Tabs.addObserver(OBSTACLES_CONTROL_ID, updateObstacles);
        updateObstacles(Tabs.getValues(OBSTACLES_CONTROL_ID));
    }
    {
        var BRUSH_RADIUS_CONTROL_ID = "brush-radius-range-id";
        var updateBrushRadius = function (radius) { brushInfo.radius = radius; };
        Range.addObserver(BRUSH_RADIUS_CONTROL_ID, updateBrushRadius);
        updateBrushRadius(Range.getValue(BRUSH_RADIUS_CONTROL_ID));
    }
    {
        var BRUSH_STRENGTH_CONTROL_ID = "brush-strength-range-id";
        var updateBrushStrength = function (strength) { brushInfo.strength = strength; };
        Range.addObserver(BRUSH_STRENGTH_CONTROL_ID, updateBrushStrength);
        updateBrushStrength(Range.getValue(BRUSH_STRENGTH_CONTROL_ID));
    }
    {
        var DISPLAY_MODE_CONTROL_ID = "displayed-fields";
        var updateDisplayMode = function (modes) {
            displayInfo.velocity = modes[0] === "velocity" || modes[1] === "velocity";
            displayInfo.pressure = modes[0] === "pressure" || modes[1] === "pressure";
        };
        Tabs.addObserver(DISPLAY_MODE_CONTROL_ID, updateDisplayMode);
        updateDisplayMode(Tabs.getValues(DISPLAY_MODE_CONTROL_ID));
    }
    {
        var COLOR_INTENSITY_CONTROL_ID = "intensity-range-id";
        var updateColorIntensity = function (intensity) { fluid.colorIntensity = intensity; };
        Range.addObserver(COLOR_INTENSITY_CONTROL_ID, updateColorIntensity);
        updateColorIntensity(Range.getValue(COLOR_INTENSITY_CONTROL_ID));
    }
    {
        var DISPLAY_COLOR_CONTROL_ID = "display-color-checkbox-id";
        var updateColor = function (display) { fluid.color = display; };
        Checkbox.addObserver(DISPLAY_COLOR_CONTROL_ID, updateColor);
        updateColor(Checkbox.isChecked(DISPLAY_COLOR_CONTROL_ID));
    }
    {
        var DISPLAY_OBSTACLES_CONTROL_ID = "display-obstacles-checkbox-id";
        var updateDisplayObstacles = function (display) { displayInfo.obstacles = display; };
        Checkbox.addObserver(DISPLAY_OBSTACLES_CONTROL_ID, updateDisplayObstacles);
        updateDisplayObstacles(Checkbox.isChecked(DISPLAY_OBSTACLES_CONTROL_ID));
    }
}
function bind(fluid) {
    bindControls(fluid);
    bindMouse();
}
exports.bind = bind;


/***/ }),

/***/ "./src/ts/requirements.ts":
/*!********************************!*\
  !*** ./src/ts/requirements.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function check(gl) {
    function setError(message) {
        Demopage.setErrorMessage("webgl-requirements", message);
    }
    var mediump = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT);
    if (mediump.precision < 23) {
        Demopage.setErrorMessage("webgl-requirements", "Your device only supports low precision float in fragment shader.\n" +
            "The simulation will not run.");
        return false;
    }
    return true;
}
exports.check = check;
var allExtensionsLoaded = false;
exports.allExtensionsLoaded = allExtensionsLoaded;
function loadExtensions(gl, extensions) {
    exports.allExtensionsLoaded = allExtensionsLoaded = true;
    var i = 0;
    for (var _i = 0, extensions_1 = extensions; _i < extensions_1.length; _i++) {
        var ext = extensions_1[_i];
        if (!gl.getExtension(ext)) {
            Demopage.setErrorMessage("no-ext" + i, "Cannot load WebGL extension '" + ext + "'.");
            exports.allExtensionsLoaded = allExtensionsLoaded = false;
        }
        ++i;
    }
}
exports.loadExtensions = loadExtensions;


/***/ }),

/***/ "./src/ts/shaders/brush-shaders.ts":
/*!*****************************************!*\
  !*** ./src/ts/shaders/brush-shaders.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var shader_1 = __importDefault(__webpack_require__(/*! ../gl-utils/shader */ "./src/ts/gl-utils/shader.ts"));
var vbo_1 = __importDefault(__webpack_require__(/*! ../gl-utils/vbo */ "./src/ts/gl-utils/vbo.ts"));
var build_shaders_1 = __webpack_require__(/*! ./build-shaders */ "./src/ts/shaders/build-shaders.ts");
var drawVert = "uniform vec2 uBrushSize; //relative, in [0,1]x[0,1]\nuniform vec2 uBrushPos; //relative, in [0,1]x[0,1]\n\nattribute vec2 aCorner; //in {-1,+1}x{-1,+1}\n\nvarying vec2 toCenter;\n\nvoid main(void) {\n    toCenter = -aCorner;\n\n    vec2 pos = uBrushPos + aCorner * uBrushSize;\n\n    gl_Position = vec4(2.0 * pos - 1.0, 0, 1);\n}";
var drawFrag = "precision mediump float;\n\nuniform float uThickness; //relative to brushRadius\n\nvarying vec2 toCenter;\n\nvoid main(void) {\n    float dist = length(toCenter);\n    if (dist < 1.0-uThickness || dist > 1.0)\n        discard;\n\n    const vec3 color = vec3(1);\n\n    gl_FragColor = vec4(color, 1.0);\n}";
var drawSrc = new build_shaders_1.ShaderSrc(drawVert, drawFrag);
function buildDrawShader(gl) {
    var shader = new shader_1.default(gl, drawSrc.vert, drawSrc.frag);
    shader.a["aCorner"].VBO = vbo_1.default.createQuad(gl, -1, -1, +1, +1);
    return shader;
}
exports.buildDrawShader = buildDrawShader;


/***/ }),

/***/ "./src/ts/shaders/build-shaders.ts":
/*!*****************************************!*\
  !*** ./src/ts/shaders/build-shaders.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function fetch(filepath) {
    var request = new XMLHttpRequest();
    request.open('GET', filepath, false);
    request.send();
    return request.responseText;
}
exports.fetch = fetch;
;
var ShaderSrc = (function () {
    function ShaderSrc(vert, frag) {
        this.vert = vert;
        this.frag = frag;
    }
    ShaderSrc.prototype.batchReplace = function (includes) {
        for (var _i = 0, includes_1 = includes; _i < includes_1.length; _i++) {
            var include = includes_1[_i];
            this.vert = this.vert.replace(new RegExp(include.toReplace), include.replacement);
            this.frag = this.frag.replace(new RegExp(include.toReplace), include.replacement);
        }
    };
    ShaderSrc.fromScript = function (vertId, fragId) {
        var vert = document.getElementById(vertId).text;
        var frag = document.getElementById(fragId).text;
        return new ShaderSrc(vert, frag);
    };
    return ShaderSrc;
}());
exports.ShaderSrc = ShaderSrc;


/***/ }),

/***/ "./src/ts/shaders/fluid-shaders.ts":
/*!*****************************************!*\
  !*** ./src/ts/shaders/fluid-shaders.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var shader_1 = __importDefault(__webpack_require__(/*! ../gl-utils/shader */ "./src/ts/gl-utils/shader.ts"));
var vbo_1 = __importDefault(__webpack_require__(/*! ../gl-utils/vbo */ "./src/ts/gl-utils/vbo.ts"));
var build_shaders_1 = __webpack_require__(/*! ./build-shaders */ "./src/ts/shaders/build-shaders.ts");
var obstacle_map_shaders_1 = __webpack_require__(/*! ./obstacle-map-shaders */ "./src/ts/shaders/obstacle-map-shaders.ts");
var rawEncodingStr = "const float MAX_SPEED = 1.0;\nconst float SPEED_BANDWIDTH = 2.01 * MAX_SPEED;\n\nconst float MIN_DIVERGENCE = -4.0 * MAX_SPEED;\nconst float MAX_DIVERGENCE =  4.0 * MAX_SPEED;\nconst float DIVERGENCE_BANDWIDTH = MAX_DIVERGENCE - MIN_DIVERGENCE;\n\nconst float MIN_PRESSURE = 0.5 * MIN_DIVERGENCE;\nconst float MAX_PRESSURE = 0.5 * MAX_DIVERGENCE;\nconst float PRESSURE_BANDWIDTH = MAX_PRESSURE - MIN_PRESSURE;\n\n/* Decodes a float value (32 bits in [0,1])\n * from a 4D value (4x8bits in [0,1]x[0,1]x[0,1]x[0,1]) */\nfloat decode32bit(vec4 v)\n{\n    const vec4 weights = 255.0 * vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0) / (256.0*256.0*256.0*256.0 - 1.0);\n    return dot(weights, v);\n}\n\n/* Encodes a float value (32 bits in [0,1])\n * into a 4D value (4x8bits in [0,1]x[0,1]x[0,1]x[0,1]) */\nvec4 encode32bit(float f)\n{\n    const vec4 base = (256.0*256.0*256.0*256.0 - 1.0) / vec4(256.0*256.0*256.0, 256.0*256.0, 256.0, 1.0);\n    return floor(mod(f * base, 256.0)) / 255.0;\n}\n\n/* Decodes a float value (16 bits in [0,1])\n * from a 2D value (2x8bits in [0,1]x[0,1]) */\nfloat decode16bit(vec2 v)\n{\n    const vec2 weights = 255.0 * vec2(256.0, 1.0) / (256.0*256.0 - 1.0);\n    return dot(weights, v);\n}\n\n/* Encodes a float value (16 bits in [0,1])\n * into a 2D value (2x8bits in [0,1]x[0,1]) */\nvec2 encode16bit(float f)\n{\n    const vec2 base = (256.0*256.0 - 1.0) / vec2(256.0, 1.0);\n    return floor(mod(f * base, 256.0)) / 255.0;\n}\n\nfloat decodeDivergence(vec4 texel) {\n    float div = decode32bit(texel);\n    return div * DIVERGENCE_BANDWIDTH + MIN_DIVERGENCE;\n}\nvec4 encodeDivergence(float div) {\n    div = (div - MIN_DIVERGENCE) / DIVERGENCE_BANDWIDTH;\n    return encode32bit(div);\n}\n\nfloat decodePressure(vec4 texel) {\n    float p = decode32bit(texel);\n    return p * PRESSURE_BANDWIDTH + MIN_PRESSURE;\n}\nvec4 encodePressure(float p) {\n    p = (p - MIN_PRESSURE) / PRESSURE_BANDWIDTH;\n    return encode32bit(p);\n}\n\n___ENCODING_VELOCITY___\n\n___ENCODING_OBSTACLES___";
var encodingVelocityFloatStr = "vec4 encodeVelocity(vec2 vel) {\n    return vec4(vel, 0, 0);\n}\nvec2 decodeVelocity(vec4 texel) {\n    return texel.rg;\n}";
var encodingVelocityNoFloatStr = "vec4 encodeVelocity(vec2 vel) {\n    vel = 0.5 * (vel / MAX_SPEED + 1.0);\n    return vec4(encode16bit(vel.x), encode16bit(vel.y));\n}\nvec2 decodeVelocity(vec4 texel) {\n    vec2 vel = vec2(decode16bit(texel.rg), decode16bit(texel.ba));\n    return (2.0 * vel - 1.0) * MAX_SPEED;\n}";
var addVelVert = "uniform vec2 uBrushSize; //relative, in [0,1]x[0,1]\nuniform vec2 uBrushPos; //relative, in [0,1]x[0,1]\n\nattribute vec2 aCorner; //{0,1}x{0,1}\n\nvarying vec2 sampleCoords;\nvarying vec2 toBrush;\n\nvoid main(void) {\n    sampleCoords = aCorner;\n    toBrush = (uBrushPos - aCorner) / uBrushSize;\n\n    gl_Position = vec4(2.0*aCorner - 1.0, 0.0, 1.0);\n}";
var addVelFrag = "precision mediump float;\n\nuniform sampler2D uVel;\n\nuniform vec2 uAddVel;\n\nvarying vec2 sampleCoords;\nvarying vec2 toBrush;\n\n___ENCODING___\n\nvoid main(void) {\n    vec2 vel = decodeVelocity(texture2D(uVel, sampleCoords));\n\n    float influence = 1.0 - clamp(length(toBrush), 0.0, 1.0);\n    vec2 toAdd = influence * uAddVel;\n\n    vel += toAdd;\n    vel *= min(1.0, MAX_SPEED / length(vel));\n\n    gl_FragColor = encodeVelocity(vel);\n}";
var fullscreenVert = "attribute vec2 aCorner; //{0,1}x{0,1}\n\nvarying vec2 sampleCoords;\n\nvoid main(void) {\n    sampleCoords = aCorner;\n    gl_Position = vec4(2.0*aCorner - 1.0, 0.0, 1.0);\n}";
var advectFrag = "precision mediump float;\n\nuniform sampler2D uQuantity; //thing to advect\nuniform sampler2D uVel;\n\nuniform vec2 uVelUnit;\nuniform float uDt;\n\nvarying vec2 sampleCoords;\n\n___ENCODING___\n\nvoid main(void) {\n    vec2 vel = decodeVelocity(texture2D(uVel, sampleCoords));\n    vec2 pos = sampleCoords - uDt * vel * uVelUnit;\n    gl_FragColor = texture2D(uQuantity, pos);\n}";
var jacobiPressureFrag = "precision mediump float;\n\nuniform sampler2D uPrevIter; //x\nuniform sampler2D uConstantTerm; //b\nuniform sampler2D uObstacles;\n\nuniform float uAlpha;\nuniform float uInvBeta;\n\nuniform vec2 uTexelSize;\n\nvarying vec2 sampleCoords;\n\n___ENCODING___\n\nvoid main(void) {\n    vec2 obstacle = decodeObstacle(texture2D(uObstacles, sampleCoords));\n    vec2 coords = sampleCoords + uTexelSize * obstacle;\n\n    float result = decodePressure(texture2D(uPrevIter, coords - vec2(uTexelSize.x,0))) +\n                   decodePressure(texture2D(uPrevIter, coords + vec2(uTexelSize.x,0))) +\n                   decodePressure(texture2D(uPrevIter, coords - vec2(0,uTexelSize.y))) +\n                   decodePressure(texture2D(uPrevIter, coords + vec2(0,uTexelSize.y)));\n\n    result += uAlpha * decodeDivergence(texture2D(uConstantTerm, coords));\n    result *= uInvBeta;\n    result = clamp(result, MIN_PRESSURE, MAX_PRESSURE);\n\n    gl_FragColor = encodePressure(result);\n}";
var divergenceFrag = "precision mediump float;\n\nuniform sampler2D uVelocity;\n\nuniform vec2 uTexelSize;\n\nvarying vec2 sampleCoords;\n\n___ENCODING___\n\nvoid main(void) {\n    vec2 top =    decodeVelocity(texture2D(uVelocity, sampleCoords + vec2(0,uTexelSize.y)));\n    vec2 bottom = decodeVelocity(texture2D(uVelocity, sampleCoords - vec2(0,uTexelSize.y)));\n    vec2 left =   decodeVelocity(texture2D(uVelocity, sampleCoords - vec2(uTexelSize.x,0)));\n    vec2 right =  decodeVelocity(texture2D(uVelocity, sampleCoords + vec2(uTexelSize.x,0)));\n\n    float div = ((right.x - left.x) + (top.y - bottom.y));\n    div *= min(1.0, MAX_DIVERGENCE / length(div));\n\n    gl_FragColor = encodeDivergence(div);\n}";
var substractGradientFrag = "precision mediump float;\n\nuniform sampler2D uVelocities;\nuniform sampler2D uPressure;\n\nuniform vec2 uTexelSize;\nuniform float uHalfInvDx;\n\nvarying vec2 sampleCoords;\n\n___ENCODING___\n\nvoid main(void) {\n    float top =    decodePressure(texture2D(uPressure, sampleCoords + vec2(0,uTexelSize.y)));\n    float bottom = decodePressure(texture2D(uPressure, sampleCoords - vec2(0,uTexelSize.y)));\n    float left =   decodePressure(texture2D(uPressure, sampleCoords - vec2(uTexelSize.x,0)));\n    float right =  decodePressure(texture2D(uPressure, sampleCoords + vec2(uTexelSize.x,0)));\n\n    vec2 grad = uHalfInvDx * vec2(right - left, top - bottom);\n\n    vec2 partialVel = decodeVelocity(texture2D(uVelocities, sampleCoords));\n    vec2 divFreeVel = partialVel - grad;\n    divFreeVel *= min(1.0, MAX_SPEED / length(divFreeVel));\n\n    gl_FragColor = encodeVelocity(divFreeVel);\n}";
var obstacleVelocityFrag = "precision mediump float;\n\nuniform sampler2D uVelocities;\nuniform sampler2D uObstacles;\n\nuniform vec2 uTexelSize;\n\nvarying vec2 sampleCoords;\n\n___ENCODING___\n\nvoid main(void) {\n    vec2 obstacle = decodeObstacle(texture2D(uObstacles, sampleCoords));\n    vec2 coords = sampleCoords + obstacle * uTexelSize;\n\n    vec2 vel = decodeVelocity(texture2D(uVelocities, coords));\n    vel *= sign(0.5 - dot(obstacle,obstacle));\n\n    gl_FragColor = encodeVelocity(vel);\n}";
var drawVelocityFrag = "precision mediump float;\n\nuniform sampler2D uVel;\nuniform float uColorIntensity;\nuniform bool uBlacknWhite;\n\nvarying vec2 sampleCoords;\n\n___ENCODING___\n\n/*\n   /---__/     __\n 0 1 2 3 4\n*/\nfloat bump(float x) {\n  return min(mix(0.0, 1.0, clamp(x, 0.0, 1.0)),\n             mix(1.0, 0.0, clamp(x-3.0, 0.0, 1.0)));\n}\n\n/* Every hue, periodic with a period of 1 */\nvec3 color(float value) {\n    value *= 6.0;\n    float r = bump(mod(value-4.0, 6.0));\n    float g = bump(mod(value-0.0, 6.0));\n    float b = bump(mod(value-2.0, 6.0));\n    return vec3(r,g,b);\n}\n\nvoid main(void) {\n    vec2 vel = decodeVelocity(texture2D(uVel, sampleCoords)) / MAX_SPEED;\n\n    vec3 c = color(atan(vel.y, vel.x) / (2.0 * 3.14159));\n    c = mix(c, vec3(1), float(uBlacknWhite));\n\n    float intensity = smoothstep(0.0, 1.0, uColorIntensity*length(vel));\n\n    gl_FragColor = vec4(intensity * c, 1);\n}";
var drawPressureFrag = "precision mediump float;\n\nuniform sampler2D uPressure;\nuniform float uColorIntensity;\nuniform bool uBlacknWhite;\n\nvarying vec2 sampleCoords;\n\n___ENCODING___\n\nvec3 color(float value) {\n    value = smoothstep(0.0, 1.0, clamp(value, 0.0, 1.0));\n    value = smoothstep(0.0, 1.0, value);\n\n    float r = smoothstep(.5, .75, value);\n    float g = min(smoothstep(.0, .25, value),\n                  1.0 - smoothstep(.75, 1.0, value));\n    float b = 1.0 - smoothstep(.25, .5, value);\n    return vec3(r,g,b);\n}\n\nvoid main(void) {\n    float pressure = decodePressure(texture2D(uPressure, sampleCoords));\n    pressure = pressure / MAX_PRESSURE;\n    pressure = clamp(256.0*uColorIntensity*pressure, -.5, .5) + 0.5;\n\n    vec3 c = color(pressure);\n    c = mix(c, vec3(pressure), float(uBlacknWhite));\n\n    gl_FragColor = vec4(c, 1);\n}";
var encodingStr = rawEncodingStr;
setUseFloatTextures(false);
function setUseFloatTextures(useFloat) {
    var replace = (useFloat) ? encodingVelocityFloatStr : encodingVelocityNoFloatStr;
    encodingStr = rawEncodingStr.replace(/___ENCODING_VELOCITY___/g, replace);
    encodingStr = encodingStr.replace(/___ENCODING_OBSTACLES___/g, obstacle_map_shaders_1.encodingStr);
}
exports.setUseFloatTextures = setUseFloatTextures;
var drawVelocitySrc = new build_shaders_1.ShaderSrc(fullscreenVert, drawVelocityFrag);
var drawPressureSrc = new build_shaders_1.ShaderSrc(fullscreenVert, drawPressureFrag);
var addVelSrc = new build_shaders_1.ShaderSrc(addVelVert, addVelFrag);
var advectSrc = new build_shaders_1.ShaderSrc(fullscreenVert, advectFrag);
var jacobiPressureSrc = new build_shaders_1.ShaderSrc(fullscreenVert, jacobiPressureFrag);
var divergenceSrc = new build_shaders_1.ShaderSrc(fullscreenVert, divergenceFrag);
var substractGradientSrc = new build_shaders_1.ShaderSrc(fullscreenVert, substractGradientFrag);
var obstaclesVelocitySrc = new build_shaders_1.ShaderSrc(fullscreenVert, obstacleVelocityFrag);
function buildFullscreenShader(gl, src) {
    var vertSrc = src.vert;
    var fragSrc = src.frag.replace(/___ENCODING___/g, encodingStr);
    var shader = new shader_1.default(gl, vertSrc, fragSrc);
    shader.a["aCorner"].VBO = vbo_1.default.createQuad(gl, 0, 0, 1, 1);
    return shader;
}
function buildDrawVelocityShader(gl) {
    return buildFullscreenShader(gl, drawVelocitySrc);
}
exports.buildDrawVelocityShader = buildDrawVelocityShader;
function buildDrawPressureShader(gl) {
    return buildFullscreenShader(gl, drawPressureSrc);
}
exports.buildDrawPressureShader = buildDrawPressureShader;
function buildAddVelShader(gl) {
    return buildFullscreenShader(gl, addVelSrc);
}
exports.buildAddVelShader = buildAddVelShader;
function buildAdvectShader(gl) {
    return buildFullscreenShader(gl, advectSrc);
}
exports.buildAdvectShader = buildAdvectShader;
function buildJacobiPressureShader(gl) {
    return buildFullscreenShader(gl, jacobiPressureSrc);
}
exports.buildJacobiPressureShader = buildJacobiPressureShader;
function buildDivergenceShader(gl) {
    return buildFullscreenShader(gl, divergenceSrc);
}
exports.buildDivergenceShader = buildDivergenceShader;
function buildSubstractGradientShader(gl) {
    return buildFullscreenShader(gl, substractGradientSrc);
}
exports.buildSubstractGradientShader = buildSubstractGradientShader;
function buildObstaclesVelocityShader(gl) {
    return buildFullscreenShader(gl, obstaclesVelocitySrc);
}
exports.buildObstaclesVelocityShader = buildObstaclesVelocityShader;


/***/ }),

/***/ "./src/ts/shaders/obstacle-map-shaders.ts":
/*!************************************************!*\
  !*** ./src/ts/shaders/obstacle-map-shaders.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var shader_1 = __importDefault(__webpack_require__(/*! ../gl-utils/shader */ "./src/ts/gl-utils/shader.ts"));
var vbo_1 = __importDefault(__webpack_require__(/*! ../gl-utils/vbo */ "./src/ts/gl-utils/vbo.ts"));
var build_shaders_1 = __webpack_require__(/*! ./build-shaders */ "./src/ts/shaders/build-shaders.ts");
var encodingStr = "vec4 encodeObstacle(vec2 normal) {\n  normal = clamp(normalize(normal), -1.0, 1.0);\n  return vec4(0.5 * normal + 0.5, 0, 0);\n}\nvec2 decodeObstacle(vec4 texel) {\n  return 2.0 * texel.rg - 1.0;\n}";
exports.encodingStr = encodingStr;
var drawVert = "attribute vec2 aCorner; //{0,1}x{0,1}\n\nvarying vec2 sampleCoords;\n\nvoid main(void) {\n    sampleCoords = aCorner;\n    gl_Position = vec4(2.0*aCorner - 1.0, 0.0, 1.0);\n}";
var drawFrag = "precision mediump float;\n\nuniform sampler2D uObstacles;\n\nvarying vec2 sampleCoords;\n\n___ENCODING___\n\nvoid main(void) {\n    vec2 obstacle = decodeObstacle(texture2D(uObstacles, sampleCoords));\n    if (dot(obstacle, obstacle) < 0.5)\n        discard;\n\n    gl_FragColor = vec4(0.5*obstacle + 0.5, 0, 0);\n}";
var addObstacleVert = "uniform vec2 uSize; //relative, in [0,1]x[0,1]\nuniform vec2 uPos; //relative, in [0,1]x[0,1]\n\nattribute vec2 aCorner; //in {-1,+1}x{-1,+1}\n\nvarying vec2 toCenter;\n\nvoid main(void) {\n    toCenter = -aCorner;\n\n    vec2 pos = uPos + aCorner * uSize;\n\n    gl_Position = vec4(2.0 * pos - 1.0, 0, 1);\n}";
var addObstacleFrag = "precision mediump float;\n\nvarying vec2 toCenter;\n\n___ENCODING___\n\nvoid main(void) {\n    float dist = length(toCenter);\n    if (dist > 1.0)\n        discard;\n\n    vec2 normal = -toCenter / dist;\n    gl_FragColor = encodeObstacle(normal);\n}";
var includes = [
    { toReplace: "___ENCODING___", replacement: encodingStr },
];
var drawSrc = new build_shaders_1.ShaderSrc(drawVert, drawFrag);
drawSrc.batchReplace(includes);
var addSrc = new build_shaders_1.ShaderSrc(addObstacleVert, addObstacleFrag);
addSrc.batchReplace(includes);
function buildDrawShader(gl) {
    var shader = new shader_1.default(gl, drawSrc.vert, drawSrc.frag);
    shader.a["aCorner"].VBO = vbo_1.default.createQuad(gl, 0, 0, 1, 1);
    return shader;
}
exports.buildDrawShader = buildDrawShader;
function buildAddShader(gl) {
    var shader = new shader_1.default(gl, addSrc.vert, addSrc.frag);
    shader.a["aCorner"].VBO = vbo_1.default.createQuad(gl, -1, -1, 1, 1);
    return shader;
}
exports.buildAddShader = buildAddShader;


/***/ })

/******/ });