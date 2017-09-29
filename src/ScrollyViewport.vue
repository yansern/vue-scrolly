<template>
<div :class="classnames"><slot></slot></div>
</template>

<script>
export default {
  name: 'scrolly-viewport',

  computed: {
    classnames() {
      return [
        'scrolly-viewport'
      ];
    },
  },
}
</script>