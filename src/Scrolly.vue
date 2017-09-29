<template>
<div :class="classnames" @mouseenter="onMouseEnter" @mousedown="onMouseDown">
  <slot></slot>
</div>
</template>

<script src="./Scrolly.js"></script>

<style lang="scss">
$scrolly-bar-size: 7px;

.scrolly {
  position: relative;

  .scrolly-bar {
    opacity: 0;
  }

  &:hover,
  &.is-scrolling {
    .scrolly-bar {
      opacity: 1;
    }
  }
}

.scrolly-viewport {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.scrolly-bar {
  position: absolute;
  border: $scrolly-bar-size solid transparent;
  cursor: pointer;
  z-index: 2;
  transition: opacity .1s ease;

  &:before {
    position: absolute;
    width: 100%;
    height: 100%;
    content: " ";
    background: rgba(0, 0, 0, 0.3);
    border-radius: $scrolly-bar-size;
    transition: background .2s ease;
  }

  &:hover {
    &:before {
      background: rgba(0, 0, 0, 0.6);
    }
  }
}

.scrolly-bar.axis-x {
  left: 0;
  bottom: 0;
  width: 100%;
  height: $scrolly-bar-size * 3;
  min-width: 20%;
  max-width: 100%;
}

.scrolly-bar.axis-y {
  top: 0;
  right: 0;
  width: $scrolly-bar-size * 3;
  height: 100%;
  min-height: 20%;
  max-height: 100%;
}
</style>