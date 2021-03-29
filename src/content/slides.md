# WebGL 2D Arts

---

## Hi!

- Lea Rosema (she/her)
- Frontend Developer at SinnerSchrader, Part of Accenture Interactive
- [https://lea.codes/](https://lea.codes/)
- [https://codepen.io/terabaud/](https://codepen.io/terabaud/)
- [@terabaud](https://twitter.com/terabaud)

---

## About this talk

- I'm focusing on 2D arts in WebGL
- Befor getting into arts we'll get into some webgl fundamentals
- Coding session
- [https://terabaud.github.io/slides-webgl/](https://terabaud.github.io/slides-webgl/)

---

## What is WebGL?

- It's a graphics library :)
- drawing points, lines, triangles, super fast
- runs on the GPU
- used in game engines and 3D libraries

---

## How to WebGL?

- Vanilla JS WebGL
- Libraries on top of WebGL, eg. ThreeJS
- Game engines, running in WebAssembly+WebGL

---

## WebGL pipeline

1. Buffers
2. Vertex shader (processes buffer data)
3. Rasterization ([demo](https://codepen.io/terabaud/full/VwKLqdw))
4. Fragment shader ([like: tixyland](https://tixy.land/))
5. Pixels on Screen 🟥 🟩 🟦

---

## Fragment Shader:

- calculates the color of a fragment(=pixel) on screen.
- this is done in parallel for all the pixels

---

## Vertex shader:

- takes vertices from a proviced buffer and projects it onto the webgl clipping space
- defines the outline of a shape

---

## WebGL clipping space

---

## GL Shader Language

- Vertex and fragment shader are executed on the GPU
- GPU-specific language GL Shader language (GLSL)
- C-like language with a `void main()`
- C-like data types
- additional data types for vectors, matrices

---

## Vertex shader Layout

```glsl
attribute vec4 position;

void main() {
  gl_Position = position;
}
```

- input via the position attribute from a buffer
- the shader is run as many times as there's data
- the vertex position output via `gl_Position`

---

## Fragment shader Layout

```glsl
precision highp float;

void main() {
  vec2 p = gl_FragCoord.xy;
  gl_FragColor = vec4(1.0, 0.5, 0, 1.0);
}
```

- The fragment shader is run for each fragment (pixel)
- pixel coordinate from `gl_FragCoord`
- the output color is set in `gl_FragColor`

---

## Types of variables

- `attribute`: the vertex shader pulls a value from a buffer and stores it in here
- `uniform`: pass variables you set in JS before you execute the shader
- `varying`: pass values from the vertex shader to the fragment shader and interpolate values

---

## Coding Session

---

---

## Appendix

# Get pixel coordinates

```glsl
uniform vec2 resolution;
vec2 p = (gl_FragCoord.xy / resolution - .5) * 2.;

// aspect ratio correction
float aspect = resolution.x / resolution.y;
p.x *= aspect;
```

---

# Coordinates from varying

## Vertex shader

```glsl
attribute vec4 position;
varying vec4 vPosition;
vposition = position;
```

## Fragment Shader

```glsl
// contains interpolated values
varying vec4 vPosition;
```

---

## Making 2D shapes with fragment shaders

- via Signed distance fields (SDFs)
- basically a function
- takes a point and returns distance to the nearest object
- if it returns a number less than zero, the point is inside an object

---

# SDF distance functions

```glsl
float sdCircle(vec2 p, float radius) {
  return length(p) - radius;
}

float scene(vec2 p) {
  return sdCircle(p, 1.);
}
```

- See [more distance functions](https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm)

---

# Combining shapes

```glsl
float merge(float a, float b) {
  return min(a, b);
}

float substract(float a, float b) {
  return max(-a, b);
}

float symmetricDiff(float a, float b) {
  return max(min(a, b), -max(a, b));
}
```

---

# Demos

- [Symmetric diff demo](https://codepen.io/terabaud/pen/dyoXjVv)
- [Combining Shapes demo](https://codepen.io/terabaud/pen/MWwjLxX)
- [Combining Shapes in 3D](https://codepen.io/terabaud/pen/MWeYvPv)

---

# Transforming coordinates

## Rotate

```glsl
vec2 rotate(vec2 p, float a) {
  return vec2(p.x * cos(a) - p.y * sin(a),
              p.x * sin(a) + p.y * cos(a));
}
```

---

# Transforming coordinates

## Repeat

```glsl
vec2 repeat(in vec2 p, in vec2 c) {
  return mod(p, c) - 0.5 * c;
}
```

---

# Thank you 👩‍💻

## Further Resources

- [https://webglfundamentals.org/](https://webglfundamentals.org/)
- [https://thebookofshaders.com/](https://thebookofshaders.com/)
- [https://www.iquilezles.org/](https://www.iquilezles.org/)
- [https://shadertoy.com/](https://shadertoy.com/)
- [https://tixy.land by M.Kleppe](https://tixy.land)
