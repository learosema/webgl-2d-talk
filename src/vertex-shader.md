---
title: Vertex Shader
layout: layouts/base.njk
---

# Vertex shader

```glsl
attribute vec4 position;

void main() {
  gl_Position = position;
}
```

- input via the position attribute from a buffer
- the shader is run as many times as there's data
- the vertex position output via `gl_Position`
