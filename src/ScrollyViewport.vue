<template>
<div :class="classnames"><slot></slot></div>
</template>

<script>
export default {
  name: 'scrolly-viewport',

  props: {
    classname: {
      type: String,
      default: '',
    },
  },

  computed: {
    classnames() {
      return [
        'scrolly-viewport',
        this.classname,
      ];
    },
  },
}
</script>