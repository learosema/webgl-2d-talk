---
title: GLSL
layout: layouts/base.njk
---

# GLSL

- semicolons are required
- distinction between float and integer numbers
- float numbers must contain a `.` (eg. `1.0`, `.5`, `5.`)
- no implicit conversion between `float` and `int`
- built-in vector/matrix arithmetics

## Data Types

- primitives (`bool`, `int`, `float`, `double`)
- vectors (`vec2`, `vec3`, `vec4`)
- matrices (`mat2`, `mat3`, `mat4`)
- texture data (`sampler2D`)

## Variable types

- [`attribute`](https://thebookofshaders.com/glossary/?search=attribute) – vertex data from WebGL buffers, only accessible in the vertex shader.
- [`uniform`](https://thebookofshaders.com/glossary/?search=uniform) – like global variables you pass in from the JavaScript side before executing the program
- [`varying`](https://thebookofshaders.com/glossary/?search=varying) – passing attributes from the vertex shader to the fragment shader and interpolate in between coordinates
