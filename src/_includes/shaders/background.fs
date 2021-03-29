precision highp float;
varying vec4 vPos;
uniform float time;
uniform vec2 resolution;

const float PI = 3.141592654;
const float DEG = PI / 180.;

vec2 rotate(in vec2 p, in float a) {
  return vec2(p.x * cos(a) - p.y * sin(a),
              p.x * sin(a) + p.y * cos(a));
}

vec2 repeat(in vec2 p, in vec2 c) {
  return mod(p, c) - 0.5 * c;
}

    // cosine based palette, 4 vec3 params, by IQ
vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return a + b*cos(6.28318*(c*t+d));
}

vec2 pixellate(in vec2 p, float r) {
  return floor(p * 100. / r) * (r / 100.);
}

float pixellate(in float p, float r) {
  return floor(p * 100. / r) * (r / 100.);
}

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float sdBox( in vec2 p, in vec2 b ) {
  vec2 d = abs(p)-b;
  return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float sub(float a, float b) {
  return max(-b, a);
}

float add(float a, float b) {
  return min(a, b);
}



vec3 rainbowPalette(in float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.00, 0.33, 0.67);
  return palette(t, a, b, c, d);
}

// 2D Random
float random (in vec2 st) {
  return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))
                * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  // Four corners in 2D of a tile
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  // Smooth Interpolation

  // Cubic Hermine Curve. 
  vec2 u = smoothstep(0.,1.,f);

  // Mix 4 coorners percentages
  return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

vec3 stars(in vec2 p, in float zoom, in float speed) {
  float g = 5.;
  vec2 p0 = rotate(p, 45. * DEG);
  vec2 p1 = p0 * zoom + vec2(time * speed);
  vec2 p2 = repeat(p1, vec2(g));
  float d2 = step(.97, noise(g * mod(floor(p1 / g), 50.)));
  float d = sdBox(rotate(p2, -45. * DEG), vec2(g / 8.));
  
  vec3 black = vec3(0);
  vec3 white = vec3(1.);
  float m = smoothstep(.0, .4, d);
  return mix(d2 * white, black, m);
}

vec3 background(in vec2 p) {
  float y = 1. - p.y * .5 + .5;
  vec3 sky = mix(vec3(0.), vec3(0, .0, .01), y);
  vec3 color = sky + stars(p, 100., 6.) * vec3(.0,.1,.2) + stars(p, 150., 4.) * vec3(.0,.0,.1);
  return color;
}

vec3 transColor(float x) {
  vec3 color1 = vec3(.3,.8,1.);
  vec3 color2 = vec3(1.,.7,.7);
  vec3 color3 = vec3(1., 1., 1.);
  float x1 = abs(x * 2. - 1.); // it's a palindrome palette
  float d1 = smoothstep(.6, .61, x1);
  float d2 = smoothstep(.2, .21, x1);
  return mix(mix(color3, color2, d2), color1, d1);
}

vec3 scene(vec2 p) {
  vec2 p1 = p * 8. - vec2(12.5, -7.);
  vec3 grey = vec3(.8);
  vec3 white = vec3(1.);
  vec3 color = background(p);
  float pole = sdBox(p1 - vec2(.7,.5), vec2(.05,1.5));
  color = mix(grey, color, smoothstep(0., .02, pole));
  vec2 flagDeform = vec2(0, sin(p1.x * 4. + time * 1.5) *.05);
  float flag = sdBox(p1 - vec2(-.35,1.4) - flagDeform, vec2(1.,.5));
  vec3 trans = transColor(clamp(p1.y-.9 - flagDeform.y,0.,1.));
  color = mix(trans, color, smoothstep(0., .02, flag));
  return color;
}

void main() {
  vec2 p = vPos.xy; // [-1..1, -1..1]
  // aspect ratio correction
  p.x *= resolution.x / resolution.y;
  vec3 color = scene(p);
  gl_FragColor = vec4(color , 1.);
}