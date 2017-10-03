<template>
<scrolly class="vertical-scrollbar-demo" :passive-scroll="true">
  <scrolly-viewport>
    <article>
      <button type="button" class="button" @click="addParagraph">Add Paragraph</button>
      <button type="button" class="button" @click="removeParagraph">Remove Paragraph</button>
      <bob-ross-lipsum :paragraphs="paragraphs"></bob-ross-lipsum>
    </article>
  </scrolly-viewport>
  <scrolly-bar axis="y"></scrolly-bar>
</scrolly>
</template>

<script>
import { Scrolly, ScrollyViewport, ScrollyBar } from '@/src';
import BobRossLipsum from './BobRossLipsum';

export default {

  data() {
    return {
      paragraphs: 4
    }
  },

  components: {
    Scrolly,
    ScrollyViewport,
    ScrollyBar,
    BobRossLipsum
  },

  methods: {
    addParagraph() {
      this.paragraphs += 1;
    },

    removeParagraph() {
      this.paragraphs -= 1;
      if (this.paragraphs <= 1) {
        this.paragraphs = 1;
      }
    }
  }
};
</script>

<style lang="scss">
.vertical-scrollbar-demo {
  width: 100%;
  height: 300px;
  border: 1px solid #ccc;

  article {
    padding: 15px;
  }

  p {
    margin-top: 10px;
  }
}
</style>
