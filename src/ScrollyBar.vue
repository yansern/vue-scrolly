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
    },
    classname: {
      type: String,
      default: '',
    },
  },

  computed: {
    classnames() {
      return [
        'scrolly-bar',
        'axis-' + this.axis,
        this.classname,
      ];
    },
  },
}
</script>