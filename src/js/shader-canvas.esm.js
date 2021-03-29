import { prefersReducedMotion } from './mediaquery.esm.js';

class ShaderCanvas extends HTMLElement {
  constructor() {
    super();
    this.canvas = null;
    this.gl = null;
    this.onResize = this.onResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.render = this.render.bind(this);
    this.onChangeReducedMotion = this.onChangeReducedMotion.bind(this);
    this.frame = -1;
  }

  static register() {
    if (typeof customElements.get('shader-canvas') === 'undefined') {
      customElements.define('shader-canvas', ShaderCanvas);
    }
  }

  connectedCallback() {
    if (!this.gl) {
      this.setup();
    }
  }

  disconnectedCallback() {
    this.dispose();
  }

  get devicePixelRatio() {
    return parseFloat(this.getAttribute('dpr')) || window.devicePixelRatio;
  }

  set playState(state) {
    if (state === 'stopped' && this.frame > -1) {
      const frame = this.frame;
      this.frame = -1;
      cancelAnimationFrame(frame);
    }
    if (state === 'running' && this.frame === -1) {
      this.frame = requestAnimationFrame(this.render);
    }
    if (state !== 'running' && state !== 'stopped') {
      console.warn(
        'shader-canvas: playState can either be set to `running` or `stopped`. You tried to set it to: ',
        state
      );
    }
  }

  get playState() {
    return this.frame > -1 ? 'running' : 'stopped';
  }

  onResize() {
    const { canvas, gl, program } = this;
    const width = this.clientWidth;
    const height = this.clientHeight;
    const dpr = this.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    const uResolution = gl.getUniformLocation(program, 'resolution');
    gl.uniform2fv(uResolution, [gl.drawingBufferWidth, gl.drawingBufferHeight]);
    if (this.playState !== 'running') {
      gl.drawArrays(gl.TRIANGLES, 0, this.count);
    }
  }

  setMouse(x, y) {
    const { gl, program } = this;
    const uMouse = gl.getUniformLocation(program, 'mouse');
    gl.uniform2fv(uMouse, [x, y]);
  }

  onMouseMove(e) {
    const aspectRatio = this.clientWidth / this.clientHeight;
    this.setMouse(
      (e.clientX / this.clientWidth - 0.5) * aspectRatio,
      0.5 - e.clientY / this.clientHeight
    );
  }

  onChangeReducedMotion() {
    if (this.prefersReducedMotion.matches) {
      this.playState = 'stopped';
    } else {
      this.playState = 'running';
    }
  }

  createShader(type, code) {
    const { gl } = this;
    const sh = gl.createShader(type, code);
    gl.shaderSource(sh, code);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      throw gl.getShaderInfoLog(sh);
    }
    return sh;
  }

  addBuffer(name, recordSize, data) {
    const { gl, program } = this;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const attribLoc = gl.getAttribLocation(program, name);
    this.buffers[name] = { buffer, data, attribLoc, recordSize };
    gl.enableVertexAttribArray(attribLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(attribLoc, recordSize, gl.FLOAT, false, 0, 0);
  }

  createBuffers() {
    const bufferScripts = [...this.querySelectorAll('[type=buffer]')];
    this.buffers = {};
    let count = -1;
    bufferScripts.forEach((container) => {
      const name = container.getAttribute('name') || 'position';
      const recordSize = parseInt(container.getAttribute('data-size'), 10) || 1;
      const data = new Float32Array(JSON.parse(container.textContent.trim()));
      count = Math.max(count, (data.length / recordSize) | 0);
      this.addBuffer(name, recordSize, data);
    });
    if (bufferScripts.length === 0) {
      // add a position buffer if no buffers provided.
      this.addBuffer(
        'position',
        2,
        new Float32Array([-1, -1, -1, 1, 1, -1, 1, -1, 1, 1, -1, 1])
      );
      count = 6; // 6 2D coords for 2 triangles.
    }
    this.count = count;
  }

  render(time = 0) {
    const { gl, program } = this;
    const uTime = gl.getUniformLocation(program, 'time');
    gl.uniform1f(uTime, time * 1e-3);
    gl.drawArrays(gl.TRIANGLES, 0, this.count);
    if (!this.prefersReducedMotion.matches) {
      this.frame = requestAnimationFrame(this.render);
    } else {
      this.frame = -1;
    }
  }

  createPrograms() {
    const { gl } = this;
    const fragScript = this.querySelector('[type=frag]');
    const vertScript = this.querySelector('[type=vert]');
    const HEADER = 'precision highp float;';
    const DEFAULT_VERT =
      HEADER + 'attribute vec4 position;void main(){gl_Position=position;}';
    const DEFAULT_FRAG = HEADER + 'void main(){gl_FragColor=vec4(1.,0,0,1.);}';

    this.fragCode = fragScript?.textContent || DEFAULT_FRAG;
    this.vertCode = vertScript?.textContent || DEFAULT_VERT;

    const program = gl.createProgram();
    this.program = program;
    this.gl = gl;

    this.fragShader = this.createShader(gl.FRAGMENT_SHADER, this.fragCode);
    this.vertShader = this.createShader(gl.VERTEX_SHADER, this.vertCode);

    gl.attachShader(program, this.fragShader);
    gl.attachShader(program, this.vertShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(program);
    }
    gl.useProgram(program);
  }

  setup() {
    this.canvas = document.createElement('canvas');
    this.dpr = window.devicePixelRatio;
    this.appendChild(this.canvas);
    this.gl =
      this.canvas.getContext('webgl') ||
      this.canvas.getContext('experimental-webgl');
    this.createPrograms();
    this.createBuffers();

    this.onResize();
    window.addEventListener('resize', this.onResize, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    this.prefersReducedMotion = prefersReducedMotion();
    this.prefersReducedMotion.addEventListener(
      'change',
      this.onChangeReducedMotion,
      false
    );
    // start the animation loop.
    this.playState = 'running';
  }

  update() {
    this.deleteProgramAndBuffers();
    this.createPrograms();
    this.createBuffers();
    this.onResize();
  }

  deleteProgramAndBuffers() {
    Object.entries(this.buffers).forEach(([name, buf]) => {
      this.gl.deleteBuffer(buf.buffer);
    });
    this.gl.deleteProgram(this.program);
  }

  dispose() {
    if (this.frame > -1) {
      cancelAnimationFrame(this.frame);
    }
    this.frame = -1;
    if (this.prefersReducedMotion) {
      this.prefersReducedMotion.removeEventListener(
        'change',
        this.onChangeReducedMotion,
        false
      );
      this.prefersReducedMotion = null;
    }
    window.removeEventListener('resize', this.onResize, false);
    window.removeEventListener('mousemove', this.onMouseMove, false);
    this.deleteProgramAndBuffers();
    const loseCtx = this.gl.getExtension('WEBGL_lose_context');
    if (loseCtx && typeof loseCtx.loseContext === 'function') {
      loseCtx.loseContext();
    }
    this.removeChild(this.canvas);
    this.gl = null;
    this.canvas = null;
    this.buffers = {};
  }
}

ShaderCanvas.register();
