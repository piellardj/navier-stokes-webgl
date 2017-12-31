# navier-stokes-webgl
Stable fluid simulation on GPU using WebGL.

Live version [here](https://piellardj.github.io/navier-stokes-webgl).

This is an implementation of the Stable Fluid described by Jos Stam.

# Simulation

The simulation is implemented on GPU with the method provided in GPU Gems.
The diffusion term was dropped since it didn't have much visual influence.

# Data storage

This simulation can run in two modes for storing the velocities:
* velocity stored in float textures: each component (x, y) is stored as a 32bit float.
To do so the following extensions must be available: `OES_texture_float`, `WEBGL_color_buffer_float`, `OES_texture_float_linear`.
* velocity stored in normal textures with four 8bit channels.
In this mode each component is stored as a 16bit fixed point value, encoded in two 8bit texture channels.
This mode provides less precision for the computing, and you can see artifacts if you push the display color intensity to the maximum.
