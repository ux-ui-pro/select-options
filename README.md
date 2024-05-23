<br>
<p align="center"><strong>select-options</strong></p>

<div align="center">

[![npm](https://img.shields.io/npm/v/select-options.svg?colorB=brightgreen)](https://www.npmjs.com/package/select-options)
[![GitHub package version](https://img.shields.io/github/package-json/v/ux-ui-pro/select-options.svg)](https://github.com/ux-ui-pro/select-options)
[![NPM Downloads](https://img.shields.io/npm/dm/select-options.svg?style=flat)](https://www.npmjs.org/package/select-options)

</div>

<p align="center">The class replaces standard HTML dropdown lists with custom ones, improving their appearance and user interaction.</p>
<p align="center"><sup>1kB gzipped</sup></p>
<p align="center"><a href="https://codepen.io/ux-ui/pen/pomJYYr">Demo</a></p>
<br>

&#10148; **Install**

```console
yarn add select-options
```
<br>

&#10148; **Import**

```javascript
import SelectOptions from 'select-options';
```
```javascript
import 'select-options/dist/select-options.css';
```
<sub>if your bundler supports SCSS</sub>
```SCSS
@import "select-options/src/styles/index.scss";
```
<br>

&#10148; **Usage**

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const selectOptions = new SelectOptions();

  selectOptions.init();
});
```
<br>

&#10148; **License**

select-options is released under MIT license
