# WebGL 2D Arts

Welcome

I'm Lea, my pronouns are she/her and I'm a frontend developer based in Hamburg, Germany.

My nickname is @terabaud. 

I'm working at Sinnerschrader, which is a digital agency operating in Hamburg, Berlin, Frankfurt, Munich and Prague.

---

I'm going to talk about creating animated 2D arts in WebGL.
Before we get into the arts I will touch some techy webgl and shader fundamentals

---
## What is WebGL?

It is a low level graphics API for the browser. 

It allows you to draw shapes (points, lines, triangles) inside a `<canvas>` element really fast.
It's really fast because the GPU* is used.

GPU stands for Graphics Processing Unit and is a second processor in your device that is optimized for graphics processing.

WebGL is also used in game engines and 3D libraries. In this talk I'm going to focus on drawing shapes in the 2D space.

---
## How does it work?

In order to draw shapes inside a webgl driven `<canvas>` you write functions working on the GPU, called shaders.

---
## Types of shaders

There are different types of shaders.

### Fragment Shader: 
- calculates the color of a fragment(=pixel) on screen.
- this is done in parallel for all the pixels -> really fast

### Vertex shader:
- takes vertices from a proviced buffer and projects it onto the webgl clipping space
- defines the outline of a shape

---
## Webgl clipping space

(insert coordinate system here)

---
## Shader Language

- C-like programming language
- semicolons are required
- typed
- C-like types (int, float, double bool)
- special types for working with vectors and matrices
- vec2, vec3, vec4
- mat2, mat3, mat4
- hard to debug

---
## Layout of a vertex shader

````glsl
attribute vec4 position;
varying vec4 vPosition;
void main() {
  vPosition = position;
  gl_Position = position;
}
```

- this is run for each vertex provided in the buffer
- takes a vertex from the position buffer and provides the data in the position attribute
- the data is directly passed to the `gl_Position` output variable

---
## Layout of a fragment shader

```glsl
varying vec4 position;
void main() {
  gl_FragColor = vec4(position.x, position.y, 1., 1.):
}
```

- fragment shader is run for each single pixel inside the provided shape, in parallel
- a vec4 is used to provide red, green and blue and alpha values the specific pixel

---
## Useful functions

- mix - interpolate between 2 values
- step(x, edge) 
- smoothstep(x0, x1, edge)
- length(v) - length of a vector (or distance to the origin zero-point)
- distance - distance between two vectors

---
## Let's start coding

- our code example create a rectangle on screen
- the content of our rectangle is driven by our fragment shader code
- creating gradients via mix
- creating circles via step and length
- building shapes by overlapping shapes

---
## Coding Session


TODO: insert codesandbox link there

---
# Thank you :)
