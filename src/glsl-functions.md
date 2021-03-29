---
title: GLSL
layout: layouts/base.njk
---

# GLSL functions

- [`length(x)`](https://thebookofshaders.com/glossary/?search=length) – length of a `float`, `vec2`, `vec3` or `vec4`
- [`distance(a, b)`](https://thebookofshaders.com/glossary/?search=distance) – distance between `a..b`
- [`step(edge, x)`](https://thebookofshaders.com/glossary/?search=step) – return 0 if `x < edge`, otherwise 1
- [`smoothstep(edge0, edge1, x)`](https://thebookofshaders.com/glossary/?search=smoothstep) – like `step` but interpolatie between `edge0` and `edge1`.
- [`mix(x, y, a)`](https://thebookofshaders.com/glossary/?search=mix) - interpolate between `x..y` with `a = 0 .. 1`
- [`min(x, y)`](https://thebookofshaders.com/glossary/?search=min) – return the lesser value
- [`max(x, y)`](https://thebookofshaders.com/glossary/?search=max) – return the greater value
- [`clamp(x, a, b)`](https://thebookofshaders.com/glossary/?search=clamp) – clamp the value between `[a .. b]`
- Trigonometric functions, eg. [`sin(x)`](https://thebookofshaders.com/glossary/?search=sin), [`cos(x)`](https://thebookofshaders.com/glossary/?search=cos), [`atan(x)`](https://thebookofshaders.com/glossary/?search=atan)
