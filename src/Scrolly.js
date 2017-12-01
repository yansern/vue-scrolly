const DOM_SUBTREE_MODIFIED_EVENT = 'DOMSubtreeModified';
const PROPERTY_CHANGE_EVENT = 'propertychange';
const MOUSE_WHEEL_EVENT = 'wheel';
const MOUSE_MOVE_EVENT = 'mousemove';
const MOUSE_UP_EVENT = 'mouseup';
const DOM_CHANGE_HANDLER_THROTTLING_RATE = 250;
const PARENT_SCROLL_ACTIVATION_POINT = 25;

import {
  throttle,
  toPercent,
  normalizeWheel,
  supportsPassiveEvents,
  supportsMutationObserver,
} from './helpers';

export default {
  name: 'scrolly',

  props: {
    parentScroll: {
      type: Boolean,
      default: true,
    },
    passiveScroll: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      container: null,
      viewport: null,
      barX: null,
      barY: null,
      onMouseWheelHandler: null,
      onDomChangeHandler: null,
      mutationObserver: null,
      isScrolling: false,
    };
  },

  computed: {
    classnames() {
      return ['scrolly', this.isScrolling ? 'is-scrolling' : ''];
    },
  },

  mounted() {
    this.$nextTick(function() {
      let container = this.$el,
        viewport,
        barX,
        barY;

      // Scan through child nodes to pick up viewport & scrollbars.
      let { childNodes } = container,
        childNode,
        i = 0;
      while ((childNode = childNodes[i++])) {
        let { className } = childNode;
        if (!className) continue;
        className.match('scrolly-viewport') && (viewport = childNode);
        className.match('axis-x') && (barX = childNode);
        className.match('axis-y') && (barY = childNode);
      }

      // If viewport or scrollbars do not exist, stop.
      if (!viewport || (!barX && !barY)) {
        return;
      }

      // Attach mouse wheel event
      const onMouseWheelHandler = this.onMouseWheel.bind(this);

      // If parentScroll is disabled, passiveScroll cannot be enabled.
      let passive = !this.parentScroll ? false : this.passiveScroll;

      container.addEventListener(
        MOUSE_WHEEL_EVENT,
        onMouseWheelHandler,
        // Unable to turn on passive: true if parentScroll is disabled.
        // Violation warning is expected in Chrome.
        supportsPassiveEvents ? { passive } : false
      );

      // Observe viewport for content changes
      const onDomChangeHandler = this.onDomChange.bind(this);
      let mutationObserver;
      if (supportsMutationObserver) {
        mutationObserver = new MutationObserver(onDomChangeHandler);
        mutationObserver.observe(viewport, {
          childList: true,
          characterData: true,
          subtree: true,
          attributes: true,
        });
      } else {
        // Fallback for browsers without mutationObserver support
        viewport.addEventListener(
          DOM_SUBTREE_MODIFIED_EVENT,
          onDomChangeHandler
        );
        viewport.addEventListener(PROPERTY_CHANGE_EVENT, onDomChangeHandler);
      }

      // Assign back to this
      Object.assign(this, {
        container,
        viewport,
        barX,
        barY,
        onMouseWheelHandler,
        onDomChangeHandler,
        mutationObserver,
      });
    });
  },

  methods: {
    onMouseEnter() {
      this.refreshScrollLayout();
    },

    onMouseDown({ target: bar, pageX: initialPageX, pageY: initialPageY }) {
      const className = bar.className;

      if (!className.match('scrolly-bar')) return;

      let scrollLayout = {};

      const self = this;
      const { barX, barY } = this;
      const { container, viewport } = this;
      const { addEventListener, removeEventListener } = window;
      const isAxisX = className.match('axis-x');
      const isAxisY = className.match('axis-y');
      const initialBarTop = bar.offsetTop;
      const initialBarLeft = bar.offsetLeft;

      self.isScrolling = true;

      function onMouseMove(event) {
        // Prevents text selection
        event.preventDefault();

        // Get current cursor position
        const { pageX, pageY } = event;

        if (isAxisX) {
          // Get viewport dimension and scroll position
          const {
            scrollLeft,
            scrollWidth,
            offsetWidth: viewportWidth,
          } = viewport;

          // Get computed bar width where the browser already
          // took account of min-width/max-width constraints.
          const barWidth = bar.offsetWidth;

          // Determine min/max bar position
          const minBarLeft = 0;
          const maxBarLeft = viewportWidth - barWidth;

          // Calculate new bar position
          let dx = pageX - initialPageX;
          let barLeft = initialBarLeft + dx;
          barLeft < minBarLeft && (barLeft = minBarLeft);
          barLeft > maxBarLeft && (barLeft = maxBarLeft);

          // Set scrollbar position
          bar.style.left = toPercent(barLeft / viewportWidth);

          // From the new scrollbar position,
          // set the new viewport scroll position.
          viewport.scrollLeft =
            barLeft / maxBarLeft * (scrollWidth - viewportWidth);

          // Determine if new bar position is on edge
          let onLeftEdge = barLeft < minBarLeft;
          let onRightEdge = barLeft > maxBarLeft;
          let onEdge = onLeftEdge || onRightEdge;

          // Determine other scroll layout properties
          let visible = true;
          let canUnlockParentScroll = false;
          let canScrollParent = false;
          let scrolled = true;

          // Create scroll layout
          scrollLayout.x = barX.scrollLayout = {
            barX,
            scrollLeft,
            scrollWidth,
            viewportWidth,
            barWidth,
            barLeft,
            minBarLeft,
            maxBarLeft,
            visible,
            onLeftEdge,
            onRightEdge,
            onEdge,
            canUnlockParentScroll,
            canScrollParent,
          };
        }

        if (isAxisY) {
          // Get viewport dimension and scroll position
          const {
            scrollTop,
            scrollHeight,
            offsetHeight: viewportHeight,
          } = viewport;

          // Get computed bar height where the browser already
          // took account of min-height/max-height constraints.
          const barHeight = bar.offsetHeight;

          // Determine min/max bar position
          const minBarTop = 0;
          const maxBarTop = viewportHeight - barHeight;

          // Calculate new bar position
          let dy = pageY - initialPageY;
          let barTop = initialBarTop + dy;
          barTop < minBarTop && (barTop = minBarTop);
          barTop > maxBarTop && (barTop = maxBarTop);

          // Set scrollbar position
          bar.style.top = toPercent(barTop / viewportHeight);

          // From the new scrollbar position,
          // set the new viewport scroll position.
          viewport.scrollTop =
            barTop / maxBarTop * (scrollHeight - viewportHeight);

          // Determine if new bar position is on edge
          let onTopEdge = barTop <= minBarTop;
          let onBottomEdge = barTop >= maxBarTop;
          let onEdge = onTopEdge || onBottomEdge;

          // Determine other scroll layout properties
          let visible = true;
          let canUnlockParentScroll = false;
          let canScrollParent = false;
          let scrolled = true;

          // Create scroll layout
          scrollLayout.y = barY.scrollLayout = {
            barY,
            scrollTop,
            scrollHeight,
            viewportHeight,
            barHeight,
            barTop,
            minBarTop,
            maxBarTop,
            onTopEdge,
            onBottomEdge,
            onEdge,
            visible,
            canUnlockParentScroll,
            canScrollParent,
            scrolled,
          };
        }

        // Emit scrollchange event
        self.$emit('scrollchange', scrollLayout);
      }

      function onMouseUp() {
        self.isScrolling = false;
        removeEventListener(MOUSE_UP_EVENT, onMouseUp);
        removeEventListener(MOUSE_MOVE_EVENT, onMouseMove);
      }

      addEventListener('mousemove', onMouseMove);
      addEventListener('mouseup', onMouseUp);
    },

    onMouseWheel(event) {
      // Normalize wheel event and get scroll delta
      const { pixelX: dx, pixelY: dy } = normalizeWheel(event);

      // Get scroll layout
      const { x: scrollLayoutX, y: scrollLayoutY } =
        // after refreshing scroll layout
        this.refreshScrollLayout(dx, dy);

      // If using passive scrolling, stop.
      if (this.passiveScroll) return;

      // Determine if scrolling of parent body should be prevented
      let canScrollParentX = scrollLayoutX && scrollLayoutX.canScrollParent;
      let canScrollParentY = scrollLayoutY && scrollLayoutY.canScrollParent;

      // If scrolling parent is not possible, prevent it.
      (!this.parentScroll || !(canScrollParentX || canScrollParentY)) &&
        event.preventDefault();
    },

    onMouseLeave(event) {
      const { barX, barY } = this;
      barX && (barX.scrollLayout = null);
      barY && (barY.scrollLayout = null);
    },

    onDomChange: throttle(function() {
      this.refreshScrollLayout();
    }, DOM_CHANGE_HANDLER_THROTTLING_RATE),

    refreshScrollLayout(dx = 0, dy = 0) {
      let scrollLayout = {};

      // Get viewport, barX, barY
      const { viewport, barX, barY } = this;

      if (barX) {
        // Update scroll position
        let scrolled = dx !== 0;
        viewport.scrollLeft += dx;

        // Get viewport dimension and scroll position
        const {
          scrollLeft,
          scrollWidth,
          offsetWidth: viewportWidth,
        } = viewport;

        // Get bar style
        const barStyle = barX.style;

        // Set the width of the bar to let the browser
        // adjust to min-width/max-width constraints.
        barStyle.visibility = 'hidden';
        barStyle.display = 'block';
        barStyle.width = toPercent(viewportWidth / scrollWidth);

        // Get computed bar width
        const barWidth = barX.offsetWidth;

        // Using the computed bar width,
        // determine minBarLeft and maxBarLeft.
        const minBarLeft = 0;
        const maxBarLeft = viewportWidth - barWidth;

        // Calculate new bar position
        let barLeft = scrollLeft / (scrollWidth - viewportWidth) * maxBarLeft;

        // Determine if new bar position is on edge
        let onLeftEdge = barLeft < minBarLeft;
        let onRightEdge = barLeft > maxBarLeft;
        let onEdge = onLeftEdge || onRightEdge;

        // If new bar position is on edge,
        // ensure it stays within min/max position.
        onLeftEdge && (barLeft = minBarLeft);
        onRightEdge && (barLeft = maxBarLeft);

        // Set bar position
        barStyle.left = toPercent(barLeft / viewportWidth);

        // Determine if bar needs to be shown
        let visible = barWidth < viewportWidth;
        barStyle.display = visible ? 'block' : 'none';
        barStyle.visibility = 'visible';

        // Determine if there's enough inertia
        // to unlock parent scrolling.
        let canUnlockParentScroll =
          Math.abs(dx) > PARENT_SCROLL_ACTIVATION_POINT;

        // Get previous scroll layout to determine
        // if we can unlock parent scrolling
        let previousScrollLayout = barX.scrollLayout || {};
        let {
          onEdge: wasOnEdge,
          canUnlockParentScroll: couldUnlockParentScroll,
          canScrollParent: couldScrollParent,
        } = previousScrollLayout;

        // Allow scrolling of parent...
        let canScrollParent =
          // ...if parent scrolling was previously unlocked,
          // continue let user scroll parent body.
          couldScrollParent ||
          // ...if scrollbar reached the edge of the viewport,
          // and user scrolled with enough inertia with
          // the intention to scroll parent body.
          (wasOnEdge && couldUnlockParentScroll);

        // Add to computedLayout
        scrollLayout.x = barX.scrollLayout = {
          barX,
          scrollLeft,
          scrollWidth,
          viewportWidth,
          barWidth,
          barLeft,
          minBarLeft,
          maxBarLeft,
          visible,
          onLeftEdge,
          onRightEdge,
          onEdge,
          visible,
          canUnlockParentScroll,
          canScrollParent,
          scrolled,
        };
      }

      if (barY) {
        // Update scroll position
        let scrolled = dy !== 0;
        viewport.scrollTop += dy;

        // Get viewport dimension and scroll position
        const {
          scrollTop,
          scrollHeight,
          offsetHeight: viewportHeight,
        } = viewport;

        // Get bar style
        const barStyle = barY.style;

        // Set the height of the bar to let the browser
        // adjust to min-height/max-height constraints.
        barStyle.visibility = 'hidden';
        barStyle.display = 'block';
        barStyle.height = toPercent(viewportHeight / scrollHeight);

        // Get computed bar height
        const barHeight = barY.offsetHeight;

        // From the computed bar height,
        // determine minBarTop and maxBarTop.
        const minBarTop = 0;
        const maxBarTop = viewportHeight - barHeight;

        // Calculate new bar position
        let barTop = scrollTop / (scrollHeight - viewportHeight) * maxBarTop;

        // Determine if new bar position is on edge
        let onTopEdge = barTop <= minBarTop;
        let onBottomEdge = barTop >= maxBarTop;
        let onEdge = onTopEdge || onBottomEdge;

        // If new bar position is on edge,
        // ensure it stays within min/max position.
        onTopEdge && (barTop = minBarTop);
        onBottomEdge && (barTop = maxBarTop);

        // Set bar position
        barStyle.top = toPercent(barTop / viewportHeight);

        // Determine if bar needs to be shown
        let visible = barHeight < viewportHeight;
        barStyle.display = visible ? 'block' : 'none';
        barStyle.visibility = 'visible';

        // Determine if there's enough inertia
        // to unlock parent scrolling.
        let canUnlockParentScroll =
          Math.abs(dy) > PARENT_SCROLL_ACTIVATION_POINT;

        // Get previous scroll layout to determine
        // if we can unlock parent scrolling
        let previousScrollLayout = barY.scrollLayout || {};
        let {
          onEdge: wasOnEdge,
          canUnlockParentScroll: couldUnlockParentScroll,
          canScrollParent: couldScrollParent,
        } = previousScrollLayout;

        // Allow scrolling of parent...
        let canScrollParent =
          // ...if scrollbar is on edge and...
          onEdge &&
          // ...if parent scrolling was previously unlocked,
          // continue let user scroll parent body.
          (couldScrollParent ||
            // ...if scrollbar reached the edge of the viewport,
            // and user scrolled with enough inertia with
            // the intention to scroll parent body.
            (wasOnEdge && couldUnlockParentScroll));

        // Add to computedLayout
        scrollLayout.y = barY.scrollLayout = {
          barY,
          scrollTop,
          scrollHeight,
          viewportHeight,
          barHeight,
          barTop,
          minBarTop,
          maxBarTop,
          onTopEdge,
          onBottomEdge,
          onEdge,
          visible,
          canUnlockParentScroll,
          canScrollParent,
          scrolled,
        };
      }

      // Emit scrollchange event
      this.$emit('scrollchange', scrollLayout);

      return scrollLayout;
    },
  },

  beforeDestroy() {
    const {
      container,
      viewport,
      barX,
      barY,
      onMouseWheelHandler,
      onDomChangeHandler,
      mutationObserver,
    } = this;

    // Disconnect mutation observer
    mutationObserver && mutationObserver.disconnect();

    // Detach onDomChangeHandler
    if (!supportsMutationObserver) {
      viewport.removeEventListener(
        DOM_SUBTREE_MODIFIED_EVENT,
        onDomChangeHandler
      );
      viewport.removeEventListener(PROPERTY_CHANGE_EVENT, onDomChangeHandler);
    }

    // Detach onMouseWheelHandler
    container.removeEventListener(MOUSE_WHEEL_EVENT, onMouseWheelHandler);
  },
};
