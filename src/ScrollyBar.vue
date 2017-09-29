<template>
<div :class="classnames"><slot></slot></div>
</template>

<script>
export default {
  name: 'scrolly-bar',

  props: {
    axis: {
      type: String,
      default: 'y'
    }
  },

  computed: {
    classnames() {
      return [
        'scrolly-bar',
        'axis-' + this.axis
      ];
    },
  },
}
</script>