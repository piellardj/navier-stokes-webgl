import * as Utils from "./gl-utils/utils";
import FBO from "./gl-utils/fbo";
import * as Controls from "./controls";
import Brush from "./brush";
import ObstacleMap from "./obstacle-map";
import Fluid from "./fluid";
import obstacleMap from "./obstacle-map";
import * as Requirements from "./requirements";

/** Initializes a WebGL context */
function initGL(canvas: HTMLCanvasElement, flags: any): WebGLRenderingContext {
    let gl: WebGLRenderingContext = canvas.getContext("webgl", flags) as WebGLRenderingContext;
    if (!gl) {
        gl = canvas.getContext("experimental-webgl", flags);
        if (!gl) {
            alert("Your browser or device does not seem to support WebGL.");
            return null;
        }
        alert("Your browser or device only supports experimental WebGL.\n" +
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
    const canvas: HTMLCanvasElement = document.getElementById("glcanvas") as HTMLCanvasElement;
    const gl: WebGLRenderingContext = initGL(canvas, { alpha: false });
    if (!gl || !Requirements.check(gl))
        return;

    const extensions: string[] = [
        "OES_texture_float",
        "WEBGL_color_buffer_float",
        "OES_texture_float_linear",
    ];
    Requirements.loadExtensions(gl, extensions);

    const size = 256;

    const fluid = new Fluid(gl, size, size);
    const brush = new Brush(gl);
    const obstacleMaps: ObstacleMap[] = [];
    obstacleMaps["none"] = new ObstacleMap(gl, size, size);
    obstacleMaps["one"] = new ObstacleMap(gl, size, size);
    {
        obstacleMaps["one"].addObstacle([0.015, 0.015], [0.3, 0.5]);
    }
    obstacleMaps["many"] = new ObstacleMap(gl, size, size);
    {
        let size = [0.012, 0.012];
        for (let iX = 0; iX < 5; ++iX) {
            for (let iY = -iX / 2; iY <= iX / 2; ++iY) {
                size = [size[0] + 0.0005, size[1] + 0.0005];
                const pos = [0.3 + iX * 0.07, 0.5 + iY * 0.08];
                obstacleMaps["many"].addObstacle(size, pos);
            }
        }
    }

    Controls.bind(canvas, fluid);

    /* Update the FPS indicator every second. */
    let instantFPS: number = 0;
    const fpsText = document.getElementById("fps-text");
    const updateFpsText = function () {
        fpsText.textContent = instantFPS.toFixed(0);
    };
    setInterval(updateFpsText, 1000);

    let lastUpdate = 0;
    function mainLoop(time) {
        time *= 0.001; //dt is now in seconds
        let dt = time - lastUpdate;
        instantFPS = 1 / dt;
        lastUpdate = time;

        /* If the javascript was paused (tab lost focus), the dt may be too big.
         * In that case we adjust it so the simulation resumes correctly. */
        dt = Math.min(dt, 1 / 10);

        const obstacleMap: ObstacleMap = obstacleMaps[Controls.obstacles];

        /* Updating */
        if (Controls.fluid.stream) {
            fluid.addVel([0.1, 0.5], [0.05, 0.2], [0.4, 0]);
        }
        fluid.update(obstacleMap);

        /* Drawing */
        FBO.bindDefault(gl);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        if (Controls.display.velocity) {
            fluid.drawVelocity();
        } else if (Controls.display.pressure) {
            fluid.drawPressure();
        }

        if (Controls.display.brush) {
            brush.draw();
        }

        if (Controls.display.obstacles) {
            obstacleMap.draw();
        }

        if (Controls.display.velocity && Controls.display.pressure) {
            gl.viewport(10, 10, 128, 128);
            fluid.drawPressure();
        }

        requestAnimationFrame(mainLoop);
    }

    requestAnimationFrame(mainLoop);
}

main();