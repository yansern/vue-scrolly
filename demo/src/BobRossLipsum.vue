<template>
<div>
  <p v-for="quote in quotes">{{ quote }}</p>
</div>
</template>

<script>

const quotes = [
"Remember how free clouds are. They just lay around in the sky all day long. We artists are a different breed of people. We're a happy bunch. Trees grow however makes them happy. We don't want to set these clouds on fire.",
"Maybe there's a little something happening right here. Isn't that fantastic? You can just push a little tree out of your brush like that. See how easy it is to create a little tree right in your world.",
"There's nothing wrong with having a tree as a friend. I'll go over the colors one more time that we use: Titanium white, Thalo green, Prussian blue, Van Dyke brown, Alizarin crimson, Sap green, Cad yellow, and Permanent red. From all of us here, I want to wish you happy painting and God bless, my friends. We're trying to teach you a technique here and how to use it. The shadows are just like the highlights, but we're going in the opposite direction. This is gonna be a happy little seascape.",
"Life is too short to be alone, too precious. Share it with a friend. Just a happy little shadow that lives in there. The least little bit can do so much. Let's build an almighty mountain. Just let your mind wander and enjoy. This should make you happy.",
"You don't want to kill all your dark areas they are very important. There is no right or wrong - as long as it makes you happy and doesn't hurt anyone. Just make little strokes like that.",
"We'll throw some old gray clouds in here just sneaking around and having fun. I sincerely wish for you every possible joy life could bring. Don't hurry. Take your time and enjoy. Happy painting, God bless. Fluff it up a little and hypnotize it.",
"Let's get wild today. It's hard to see things when you're too close. Take a step back and look. Tree trunks grow however makes them happy. That's what painting is all about. It should make you feel good when you paint. Son of a gun."
];

export default {

  props: {
    paragraphs: {
      type: Number,
      default: 1
    }
  },

  computed: {
    quotes() {

      let paragraphCount = this.paragraphs;
      let selectedQuotes = [];
      let i = 0;

      if (paragraphCount <= 1) {
        paragraphCount = 1;
      }

      while (paragraphCount--) {
        selectedQuotes.push(quotes[i++] || quotes[i=0]);
      }

      return selectedQuotes;
    }
  }
}
</script>