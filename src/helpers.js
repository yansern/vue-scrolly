import normalizeWheel from 'normalize-wheel';

// https://remysharp.com/2010/07/21/throttling-function-calls
function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last, deferTimer;
  return function() {
    var context = scope || this;

    var now = +new Date(),
      args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function() {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

function toPercent(n) {
  return n * 100 + '%';
}

// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
// Test via a getter in the options object to see if the passive property is accessed
let supportsPassiveEvents = false;
try {
  let opts = Object.defineProperty({}, 'passive', {
    get: function() {
      supportsPassiveEvents = true;
    },
  });
  window.addEventListener('test', null, opts);
} catch (e) {}

let supportsMutationObserver = window === 'undefined' ? false : 'MutationObserver' in window;

export {
  throttle,
  toPercent,
  normalizeWheel,
  supportsPassiveEvents,
  supportsMutationObserver,
};
