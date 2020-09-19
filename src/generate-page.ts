import * as fs from "fs";
import * as path from "path";
import { Demopage } from "webpage-templates";

const data = {
    title: "Navier-Stokes",
    description: "Stable fluid simulation running on GPU",
    introduction: [
        "This project is a WebGL incompressible fluid simulation running entirely on your GPU. You can interact with the fluid with the left mouse button and visualize both the velocity and the pressure of the fluid.",
        "This is an implementation of the Stable Fluid described by J. Stam."
    ],
    githubProjectName: "navier-stokes-webgl",
    additionalLinks: [],
    scriptFiles: [
        "script/main.js"
    ],
    indicators: [
        {
            id: "fps",
            label: "FPS"
        }
    ],
    canvas: {
        width: 512,
        height: 512,
        enableFullscreen: false
    },
    controlsSections: [
        {
            title: "Simulation",
            controls: [
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Resolution",
                    id: "resolution",
                    unique: true,
                    options: [
                        {
                            value: "128",
                            label: "128"
                        },
                        {
                            value: "256",
                            label: "256",
                            checked: true
                        },
                        {
                            value: "512",
                            label: "512"
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Float texture",
                    id: "float-texture-checkbox-id",
                    checked: true
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Solver steps",
                    id: "solver-steps-range-id",
                    min: 1,
                    max: 99,
                    value: 49,
                    step: 2
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Time step",
                    id: "timestep-range-id",
                    min: 0.01,
                    max: 0.1,
                    value: 0.033,
                    step: 0.001
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Stream",
                    id: "stream-checkbox-id",
                    checked: true
                },
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Obstacles",
                    id: "obstacles",
                    unique: true,
                    options: [
                        {
                            value: "none",
                            label: "None"
                        },
                        {
                            value: "one",
                            label: "One"
                        },
                        {
                            value: "many",
                            label: "Many",
                            checked: true
                        }
                    ]
                }
            ]
        },
        {
            title: "Brush",
            controls: [
                {
                    type: Demopage.supportedControls.Range,
                    title: "Radius",
                    id: "brush-radius-range-id",
                    min: 20,
                    max: 100,
                    value: 40,
                    step: 1
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Strength",
                    id: "brush-strength-range-id",
                    min: 20,
                    max: 200,
                    value: 100,
                    step: 1
                }
            ]
        },
        {
            title: "Display",
            controls: [
                {
                    type: Demopage.supportedControls.Tabs,
                    title: "Fields",
                    id: "displayed-fields",
                    unique: false,
                    options: [
                        {
                            value: "velocity",
                            label: "Velocity",
                            checked: true
                        },
                        {
                            value: "pressure",
                            label: "Pressure"
                        }
                    ]
                },
                {
                    type: Demopage.supportedControls.Range,
                    title: "Intensity",
                    id: "intensity-range-id",
                    min: 0.1,
                    max: 10,
                    value: 1,
                    step: 0.1
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Color",
                    id: "display-color-checkbox-id",
                    checked: true
                },
                {
                    type: Demopage.supportedControls.Checkbox,
                    title: "Obstacles",
                    id: "display-obstacles-checkbox-id",
                    checked: true
                }
            ]
        }
    ]
};

const DEST_DIR = path.resolve(__dirname, "..", "docs");
const minified = true;

const buildResult = Demopage.build(data, DEST_DIR, {
    debug: !minified,
});

// disable linting on this file because it is generated
buildResult.pageScriptDeclaration = "/* tslint:disable */\n" + buildResult.pageScriptDeclaration;

const SCRIPT_DECLARATION_FILEPATH = path.resolve(__dirname, ".", "ts", "page-interface-generated.ts");
fs.writeFileSync(SCRIPT_DECLARATION_FILEPATH, buildResult.pageScriptDeclaration);
