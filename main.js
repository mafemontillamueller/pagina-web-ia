// Consolidated inline scripts from index.html
// Order assumes external libraries (jQuery, Lenis, GSAP, ScrollTrigger, SplitType, PureCounter) are loaded before this file.

// Lenis smooth scroll init — desktop only (mobile uses native touch scroll)
if (typeof Lenis !== 'undefined' && !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
  const lenis = new Lenis();
  lenis.on('scroll', (e) => {
    // console.log(e)
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// Cookie consent (flowBaseCookie provided by flowbase cookie script)
if (typeof flowBaseCookie === 'function') {
  try { flowBaseCookie('#cookieBlock', '#accept', '#clr', 30); } catch (err) { console.warn('flowBaseCookie error', err); }
}

// Text split + GSAP reveal
function initTextSplitAndReveal() {
  if (typeof SplitType === 'undefined' || typeof gsap === 'undefined') return;
  let elementsToSplit = $(".split-lines");
  let instancesOfSplit = [];

  function runSplit() {
    elementsToSplit.each(function (index) {
      let currentElement = $(this);
      instancesOfSplit[index] = new SplitType(currentElement, { types: "lines, words" });
    });
    $(".line").each(function () {
      if (!$(this).find('.line-mask').length) $(this).append("<div class='line-mask'></div>");
    });
  }

  runSplit();
  let windowWidth = $(window).innerWidth();
  window.addEventListener("resize", function () {
    if (windowWidth !== $(window).innerWidth()) {
      windowWidth = $(window).innerWidth();
      elementsToSplit.each(function (index) {
        try { instancesOfSplit[index].revert(); } catch (e) {}
      });
      runSplit();
      createAnimation();
    }
  });

  gsap.registerPlugin(ScrollTrigger);

  function createAnimation() {
    $(".line").each(function () {
      let $el = $(this);
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: $el,
          start: "top center",
          end: "bottom center",
          scrub: 1
        }
      });
      tl.to($el.find(".line-mask"), { width: "0%", duration: 1 });
    });
  }

  createAnimation();
}

// Initialize when libraries are available
function tryInitTextSplit() {
  if (typeof SplitType !== 'undefined' && typeof gsap !== 'undefined' && typeof $ !== 'undefined') {
    initTextSplitAndReveal();
  } else {
    setTimeout(tryInitTextSplit, 200);
  }
}
tryInitTextSplit();

// PureCounter initializations
function initPureCounters() {
  if (typeof PureCounter === 'undefined') return;

  try {
    new PureCounter({ selector: '.figure-animate_founded', start: 2, end: 17, duration: 1.5, delay: 10, once: true, repeat: false, decimals: 0, legacy: true, filesizing: false, currency: false, separator: false });
    new PureCounter({ selector: '.figure-animate_served', start: 15, end: 30, duration: 1.5, delay: 10, once: true, repeat: false, decimals: 0, legacy: true, filesizing: false, currency: false, separator: false });
    new PureCounter({ selector: '.figure-animate_spend', start: 35, end: 50, duration: 1.5, delay: 10, once: true, repeat: false, decimals: 0, legacy: true, filesizing: false, currency: false, separator: false });
    new PureCounter({ selector: '.figure-animate_clicks', start: 185, end: 200, duration: 1.5, delay: 10, once: true, repeat: false, decimals: 0, legacy: true, filesizing: false, currency: false, separator: false });
  } catch (err) { console.warn('PureCounter init error', err); }
}

function tryInitPureCounter() {
  if (typeof PureCounter !== 'undefined') initPureCounters(); else setTimeout(tryInitPureCounter, 200);
}
tryInitPureCounter();

// Shader background animation for the first section
function initShaderBackground() {
  const canvas = document.createElement('canvas');
  canvas.id = 'shader-background';
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.style.position = heroSection.style.position || 'relative';
    heroSection.prepend(canvas);
  } else {
    document.body.prepend(canvas);
  }

  const gl = canvas.getContext('webgl');
  if (!gl) {
    console.warn('WebGL not supported.');
    return;
  }

  const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
      gl_Position = aVertexPosition;
    }
  `;

  const fsSource = `
    precision highp float;
    uniform vec2 iResolution;
    uniform float iTime;

    const float overallSpeed = 0.2;
    const float gridSmoothWidth = 0.015;
    const float axisWidth = 0.05;
    const float majorLineWidth = 0.025;
    const float minorLineWidth = 0.0125;
    const float majorLineFrequency = 5.0;
    const float minorLineFrequency = 1.0;
    const vec4 gridColor = vec4(0.5);
    const float scale = 5.0;
    const vec4 lineColor = vec4(0.4, 0.2, 0.8, 1.0);
    const float minLineWidth = 0.01;
    const float maxLineWidth = 0.2;
    const float lineSpeed = 1.0 * overallSpeed;
    const float lineAmplitude = 1.0;
    const float lineFrequency = 0.2;
    const float warpSpeed = 0.2 * overallSpeed;
    const float warpFrequency = 0.5;
    const float warpAmplitude = 1.0;
    const float offsetFrequency = 0.5;
    const float offsetSpeed = 1.33 * overallSpeed;
    const float minOffsetSpread = 0.6;
    const float maxOffsetSpread = 2.0;
    const int linesPerGroup = 16;

    #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
    #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
    #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))
    #define drawPeriodicLine(freq, width, t) drawCrispLine(freq / 2.0, width, abs(mod(t, freq) - (freq) / 2.0))

    float drawGridLines(float axis) {
      return drawCrispLine(0.0, axisWidth, axis)
            + drawPeriodicLine(majorLineFrequency, majorLineWidth, axis)
            + drawPeriodicLine(minorLineFrequency, minorLineWidth, axis);
    }

    float random(float t) {
      return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
    }

    float getPlasmaY(float x, float horizontalFade, float offset) {
      return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
    }

    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      vec2 uv = fragCoord.xy / iResolution.xy;
      vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

      float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);
      float verticalFade = 1.0 - (cos(uv.y * 6.28) * 0.5 + 0.5);

      space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
      space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

      vec4 lines = vec4(0.0);
      vec4 bgColor1 = vec4(0.1, 0.1, 0.3, 1.0);
      vec4 bgColor2 = vec4(0.3, 0.1, 0.5, 1.0);

      for(int l = 0; l < linesPerGroup; l++) {
        float normalizedLineIndex = float(l) / float(linesPerGroup);
        float offsetTime = iTime * offsetSpeed;
        float offsetPosition = float(l) + space.x * offsetFrequency;
        float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
        float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
        float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
        float linePosition = getPlasmaY(space.x, horizontalFade, offset);
        float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

        float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
        vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
        float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

        line = line + circle;
        lines += line * lineColor * rand;
      }

      vec4 fragColor = mix(bgColor1, bgColor2, uv.x);
      fragColor *= verticalFade;
      fragColor.a = 1.0;
      fragColor += lines;
      gl_FragColor = fragColor;
    }
  `;

  const loadShader = (glContext, type, source) => {
    const shader = glContext.createShader(type);
    glContext.shaderSource(shader, source);
    glContext.compileShader(shader);
    if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
      console.error('Shader compile error:', glContext.getShaderInfoLog(shader));
      glContext.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const initShaderProgram = (glContext, vertexSource, fragmentSource) => {
    const vertexShader = loadShader(glContext, glContext.VERTEX_SHADER, vertexSource);
    const fragmentShader = loadShader(glContext, glContext.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return null;

    const shaderProgram = glContext.createProgram();
    glContext.attachShader(shaderProgram, vertexShader);
    glContext.attachShader(shaderProgram, fragmentShader);
    glContext.linkProgram(shaderProgram);
    if (!glContext.getProgramParameter(shaderProgram, glContext.LINK_STATUS)) {
      console.error('Shader program link error:', glContext.getProgramInfoLog(shaderProgram));
      return null;
    }
    return shaderProgram;
  };

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  if (!shaderProgram) return;

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
     1.0,  1.0,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const attribLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
  const uniformResolution = gl.getUniformLocation(shaderProgram, 'iResolution');
  const uniformTime = gl.getUniformLocation(shaderProgram, 'iTime');

  const resizeCanvas = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    gl.viewport(0, 0, width, height);
  };

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const startTime = Date.now();
  const render = () => {
    const currentTime = (Date.now() - startTime) / 1000;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(attribLocation);
    gl.vertexAttribPointer(attribLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(uniformResolution, canvas.width, canvas.height);
    gl.uniform1f(uniformTime, currentTime);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

initShaderBackground();

// Misc DOM handlers (open first review, remove edit helper classes, hide hero_scroll on small screens)
document.addEventListener('DOMContentLoaded', function () {
  try {
    var reviewList = document.querySelector('.review_list');
    if (reviewList) {
      var reviewItem = reviewList.querySelector('.review_item');
      if (reviewItem) {
        var dropdownVisible = reviewItem.querySelector('.dropdown_visible');
        if (dropdownVisible && typeof dropdownVisible.click === 'function') dropdownVisible.click();
      }
    }
  } catch (e) { }

  try {
    var element = document.querySelector('.brand-section.is-service.edit');
    if (element) element.classList.remove('edit');
  } catch (e) { }

  try {
    var elementText = document.querySelector('.text-wrapper.edit');
    if (elementText) elementText.classList.remove('edit');
  } catch (e) { }

  try {
    var screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    if (screenHeight < 835) {
      var heroElement = document.getElementById('hero_scroll');
      if (heroElement) heroElement.style.display = 'none';
    }
  } catch (e) { }

  // En móvil, forzar Lottie del splash a reproducirse como loop independiente
  // (en desktop es scroll-driven por IX2; en móvil no hay suficiente scroll)
  try {
    if (window.innerWidth <= 767) {
      var wfLottie = window.Webflow && window.Webflow.require && window.Webflow.require('lottie');
      if (wfLottie && wfLottie.lottie) {
        var splashEl = document.querySelector('.splash_lottie-1');
        if (splashEl) {
          splashEl.innerHTML = '';
          wfLottie.lottie.loadAnimation({
            container: splashEl,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'https://cdn.prod.website-files.com/64bfa5eec3353671101c9bd1/64f885c762524263f8706468_adsorb_graphic_element_safari.json'
          });
        }
      }
    }
  } catch (e) {}

});
