import Brush from "./brush";
import Fluid from "./fluid";
import * as Requirements from "./requirements";

class Mouse {
    private elt: HTMLElement;

    public pressed: boolean;

    private _posInPx: number[];
    private _pos: number[];

    private _movementInPx: number[];
    private _movement: number[];

    private _pivotInPx: number[];

    constructor(elt: HTMLElement) {
        this.elt = elt;
        this._posInPx = [0, 0];
        this._pivotInPx = [0, 0];
        this.setPosInPx([0, 0]);
        this.setMovementInPx([0, 0]);

        const mouse = this;
        const mouseMove = (e) => {
            const absolutePos = [e.clientX, e.clientY];
            mouse.setPosInPx(mouse.documentToElement(absolutePos));
        };
        const mouseDown = () => {
            mouse.pressed = true;
            mouse.setMovementInPx([0, 0]);
            mouse._pivotInPx = mouse._posInPx;
        };
        const mouseUp = () => { mouse.pressed = false; };

        document.addEventListener("mousemove", mouseMove, false);
        elt.addEventListener("mousedown", mouseDown, false);
        document.addEventListener("mouseup", mouseUp, false);
    }

    public get posInPx(): number[] {
        return this._posInPx;
    }

    public get pos(): number[] {
        return this._pos;
    }

    public get movementInPx(): number[] {
        return this._movementInPx;
    }

    public get movement(): number[] {
        return this._movement;
    }

    private setPosInPx(pos: number[]): void {
        const toPivot: number[] = [
            this._pivotInPx[0] - pos[0],
            this._pivotInPx[1] - pos[1]
        ];
        const distToPivot = Math.sqrt(toPivot[0] * toPivot[0] + toPivot[1] * toPivot[1]);
        const maxDist = 16;

        if (distToPivot > maxDist) {
            toPivot[0] *= maxDist / distToPivot;
            toPivot[1] *= maxDist / distToPivot;

            this._pivotInPx[0] = pos[0] + toPivot[0];
            this._pivotInPx[1] = pos[1] + toPivot[1];
        }
        const movementInPx = [-toPivot[0] / maxDist, -toPivot[1] / maxDist];
        this.setMovementInPx(movementInPx);
        this._posInPx = pos;
        this._pos = this.setRelative(pos);
    }

    private setMovementInPx(movement: number[]): void {
        this._movementInPx = movement;
        this._movement = this.setRelative(movement);
    }

    private setRelative(pos: number[]): number[] {
        return [
            pos[0] / this.elt.clientWidth,
            pos[1] / this.elt.clientHeight
        ];
    }
    private documentToElement(pos: number[]): number[] {
        const rect = this.elt.getBoundingClientRect();
        return [
            pos[0] - rect.left,
            this.elt.clientHeight - (pos[1] - rect.top),
        ];
    }
}

let mouse: Mouse = new Mouse(document.body);

function bindMouse(canvas: HTMLCanvasElement): void {
    mouse = new Mouse(canvas);
}

interface BrushInfo {
    radius: number,
    strength: number,
}
const brushInfo: BrushInfo = {
    radius: 10,
    strength: 100,
}

interface FluidInfo {
    stream: boolean;
}
const fluidInfo: FluidInfo = {
    stream: true,
}

type ObstaclesInfo = "none" | "one" | "many";
let obstaclesInfo: ObstaclesInfo = "none";

interface DisplayInfo {
    velocity: boolean,
    pressure: boolean,
    brush: boolean,
    obstacles: boolean,
}
const displayInfo: DisplayInfo = {
    velocity: true,
    pressure: true,
    brush: true,
    obstacles: true,
}

function bindControls(fluid: Fluid): void {
    function bindInput(element: HTMLElement, func, input: string) {
        element.addEventListener(input, func, false);
        func();
    }

    {
        function setResolution(size: number, radio: HTMLInputElement) {
            if (radio.checked) {
                fluid.reset(size, size);
            }
        }
        const resolutions: number[] = [128, 256, 512];

        for (let res of resolutions) {
            const radioName = "resolution-" + res + "-button";
            const radio = document.getElementById(radioName) as HTMLInputElement;
            const update = () => { setResolution(res, radio); };
            bindInput(radio, update, "change");
        }
    }

    {
        const floatCheckbox: HTMLInputElement = document.getElementById("float-checkbox") as HTMLInputElement;
        if (!Requirements.allExtensionsLoaded) {
            floatCheckbox.disabled = true;
            floatCheckbox.checked = false;

            const label = document.getElementById("float-label");
            label.innerHTML = "(extensions not available)";
            label.style.color = "#999999";
        }
        const updateFloat = () => { fluid.useFloatTextures = floatCheckbox.checked; };
        bindInput(floatCheckbox, updateFloat, "change");
    }

    {
        const iterationsSlider: HTMLInputElement = document.getElementById("iterations-slider") as HTMLInputElement;
        const updateIterations = () => { fluid.minNbIterations = +iterationsSlider.value; };
        bindInput(iterationsSlider, updateIterations, "input");
    }
    {
        const timestepSlider: HTMLInputElement = document.getElementById("timestep-slider") as HTMLInputElement;
        const updateTimestep = () => { fluid.timestep = +timestepSlider.value; };
        bindInput(timestepSlider, updateTimestep, "input");
    }

    {
        const streamCheckbox: HTMLInputElement = document.getElementById("stream-checkbox") as HTMLInputElement;
        const updateStream = () => { fluidInfo.stream = streamCheckbox.checked; };
        bindInput(streamCheckbox, updateStream, "change");
    }

    {
        function selectObstacles(name: ObstaclesInfo, radio: HTMLInputElement) {
            if (radio.checked) {
                obstaclesInfo = name;
            }
        }
        const names: ObstaclesInfo[] = ["none", "one", "many"];

        for (let name of names) {
            const radioName = "obstacles-" + name + "-button";
            const radio = document.getElementById(radioName) as HTMLInputElement;
            const update = () => { selectObstacles(name, radio); };
            bindInput(radio, update, "change");
        }
    }

    {
        const brushRadiusSlider: HTMLInputElement = document.getElementById("brush-radius-slider") as HTMLInputElement;
        const updateBrushRadius = () => { brushInfo.radius = +brushRadiusSlider.value; };
        bindInput(brushRadiusSlider, updateBrushRadius, "input");
    }
    {
        const brushStrengthSlider: HTMLInputElement = document.getElementById("brush-strength-slider") as HTMLInputElement;
        const updateBrushStrength = () => { brushInfo.strength = +brushStrengthSlider.value; };
        bindInput(brushStrengthSlider, updateBrushStrength, "input");
    }


    {
        const colorIntensitySlider: HTMLInputElement = document.getElementById("color-intensity-slider") as HTMLInputElement;
        const updateColorIntensity = () => { fluid.colorIntensity = +colorIntensitySlider.value; };
        bindInput(colorIntensitySlider, updateColorIntensity, "input");
    }
    {
        const colorCheckbox: HTMLInputElement = document.getElementById("color-checkbox") as HTMLInputElement;
        const updateColor = () => { fluid.color = colorCheckbox.checked; };
        bindInput(colorCheckbox, updateColor, "change");
    }


    {
        const displayVelocityCheckbox: HTMLInputElement = document.getElementById("display-velocity-button") as HTMLInputElement;
        const updateDisplayVelocity = () => { displayInfo.velocity = displayVelocityCheckbox.checked; };
        bindInput(displayVelocityCheckbox, updateDisplayVelocity, "change");
    }
    {
        const displayPressureCheckbox: HTMLInputElement = document.getElementById("display-pressure-button") as HTMLInputElement;
        const updateDisplayPressure = () => { displayInfo.pressure = displayPressureCheckbox.checked; };
        bindInput(displayPressureCheckbox, updateDisplayPressure, "change");
    }
    {
        const displayObstaclesCheckbox: HTMLInputElement = document.getElementById("obstacles-checkbox") as HTMLInputElement;
        const updateDisplayObstacles = () => { displayInfo.obstacles = displayObstaclesCheckbox.checked; };
        bindInput(displayObstaclesCheckbox, updateDisplayObstacles, "change");
    }
}

function bind(canvas: HTMLCanvasElement, fluid: Fluid): void {
    bindControls(fluid);
    bindMouse(canvas);
}

export { mouse, bind, brushInfo as brush, displayInfo as display, obstaclesInfo as obstacles, fluidInfo as fluid };