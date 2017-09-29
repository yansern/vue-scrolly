import Scrolly from './Scrolly.vue';
import ScrollyViewport from './ScrollyViewport.vue';
import ScrollyBar from './ScrollyBar.vue';

export { Scrolly, ScrollyViewport, ScrollyBar };

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('scrolly', Scrolly);
  window.Vue.component('scrolly-viewport', ScrollyViewport);
  window.Vue.component('scrolly-bar', ScrollyBar);
}
