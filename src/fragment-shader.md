---
title: Fragment Shader
layout: layouts/base.njk
---

# Fragment shader

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
