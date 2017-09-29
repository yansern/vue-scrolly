# vue-scrolly ![npm tag](https://img.shields.io/npm/v/vue-scrolly.svg)
> Overlay scrollbar for [Vue.js](http://vuejs.org).

<p align="center">
<img src="https://raw.githubusercontent.com/yansern/vue-scrolly/master/demo/preview.gif" />
<br/>
<b>Check out the <a href="https://yansern.github.io/vue-scrolly/demo/index.html" target="_blank">live demo</a>.</b>
</p>

## Features
* Uses MutationObserver to track and update scrollbar size & position.
* Supports vertical & horizontal scrollbars.
* Configure everything using CSS!

## Installation
```bash
$ npm install vue-scrolly
```

## Using vue-scrolly

First, import `vue-scrolly` into your Vue component.
```js
import { Scrolly, ScrollyViewport, ScrollyBar } from 'vue-scrolly';

export default {
  // ...
  components: {
    Scrolly,
    ScrollyViewport,
    ScrollyBar
  }
}
```

Then, construct your div block with overlay scrollbar using scrolly component.
```html
<scrolly class="foo" :style="{ width: '400px', height: '300px' }">
  <scrolly-viewport>
    <!-- Your contents here -->
  </scrolly>
  <scrolly-bar axis="y"></scrolly-bar>
  <scrolly-bar axis="x"></scrolly-bar>
</scrolly>
```

## Customizing overlay scrollbar
You can customize the appearance of the overlay scrollbar using CSS overrides.

This simple example below creates custom blue overlay scrollbar:
```css
.scrolly.foo .scrolly-bar:before {
    background: blue;
}
```

For complete reference, you can look at [vue-scrolly's default CSS stylesheet](https://github.com/yansern/vue-scrolly/blob/master/src/Scrolly.vue) from the main Scrolly.vue component file.


## Options

**ScrollyBar**

|    Property    |    Description   |   Type   |  Default |
| -----------------  | ---------------- | :--------: | :----------: |
| axis    | Displays horizontal or vertical scrollbar. |String [x, y] | y |


## License
**[vue-scrolly](https://github.com/yansern/vue-scrolly)** by [Yan Sern](https://twitter.com/yansernio) licensed under the [MIT+BSD](LICENSE). This project also uses [normalizeWheel](https://www.npmjs.com/package/normalize-wheel) packaged by [basilfx](https://www.npmjs.com/~basilfx) which contains codes extracted from BSD-licensed [Fixed Data Table](https://github.com/facebook/fixed-data-table) project by Facebook.

> PS: I would love to know if you're using vue-scrolly. Tweet to me at [@yansernio](https://twitter.com/yansernio).
