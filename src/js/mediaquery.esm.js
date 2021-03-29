const stub = Object.freeze({
  matches: false,
  addListener() {},
  addEventListener() {},
  removeListener() {},
  removeEventListener() {},
});

/**
 * Adds missing event listener functions to MediaQueryList object
 *
 * @param {*} mediaQueryList return value of window.matchMedia
 */
const patchMatchMedia = (mediaQueryList) => {
  if ('onchange' in mediaQueryList === false) {
    mediaQueryList.onchange = null;
    mediaQueryList.addEventListener = (_eventType, fn) => {
      mediaQueryList.addListener(fn.bind(mediaQueryList));
    };
    mediaQueryList.removeEventListener = (_eventType, fn) => {
      mediaQueryList.removeListener(fn.bind(mediaQueryList));
    };
  }
  return mediaQueryList;
};

/**
 * Polyfilled wrapper around `window.matchMedia`.
 *
 * @param {string} query a css media query
 */
function mediaQuery(query) {
  const hasMediaQuery = typeof window !== 'undefined' && 'matchMedia' in window;
  const mediaQuery = hasMediaQuery && patchMatchMedia(window.matchMedia(query));
  return mediaQuery || stub;
}

export function prefersReducedMotion() {
  return mediaQuery('(prefers-reduced-motion: reduce)');
}

export function touchScreen() {
  return mediaQuery('(hover: none) and (pointer: coarse)');
}
