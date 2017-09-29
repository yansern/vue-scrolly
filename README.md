# vue-scrolly ![npm tag](https://img.shields.io/npm/v/vue-scrolly.svg)
> Overlay scrollbar for [Vue.js](http://vuejs.org).

<p align="center">
<img src="https://raw.githubusercontent.com/yansern/vue-scrolly/master/demo/preview.gif" />
<br/>
<b>Check out the <a href="https://yansern.github.io/vue-scrolly/demo/index.html" target="_blank">live demo</a>.</b>
</p>

## Features
* Uses MutationObserver to track and update scrollbar size & position.
* Supports both vertical & horizontal scrollbars.
* Customize everything with CSS including minHeight/maxHeight/minWidth/maxWidth configurations.

## Installation
```bash
$ npm install vue-scrolly
```

## Using vue-scrolly

First, import vue-scrolly into your existing Vue component.
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

Then, construct your html block with overlay scrollbar using scrolly components.
```html
<scrolly class="foo">
  <scrolly-viewport>
    <!-- Your contents here -->
  </scrolly>
  <scrolly-bar axis="y"></scrolly-bar>
  <scrolly-bar axis="x"></scrolly-bar>
</scrolly>
```

Finally, remember to add a dimension to your html block.
```css
.scrolly.foo {
  width: 400px;
  height: 300px;
}
```

## Customizing scrolly
You can customize the appearance of the overlay scrollbars using CSS overrides.

For example, this CSS snippet creates blue overlay scrollbar:
```css
.scrolly.foo .scrolly-bar:before {
    background: blue;
}
```

For complete reference, you can look at [vue-scrolly's default CSS styling](https://github.com/yansern/vue-scrolly/blob/master/src/Scrolly.vue) from the main Scrolly.vue component file.


## Options

**ScrollyBar**

|    Property    |    Description   |   Type   |  Default |
| -----------------  | ---------------- | :--------: | :----------: |
| axis    | Displays horizontal or vertical scrollbar. |String [x, y] | y |


## License
**[vue-scrolly](https://github.com/yansern/vue-scrolly)** by [Yan Sern](https://twitter.com/yansernio) licensed under the [MIT+BSD](LICENSE). This project also uses [normalizeWheel](https://www.npmjs.com/package/normalize-wheel) packaged by [basilfx](https://www.npmjs.com/~basilfx) which contains codes extracted from BSD-licensed [Fixed Data Table](https://github.com/facebook/fixed-data-table) project by Facebook.

> PS: I would love to know if you're using vue-scrolly. Tweet to me at [@yansernio](https://twitter.com/yansernio).
