<br>
<p align="center"><strong>select-options</strong></p>

<div align="center">

[![npm](https://img.shields.io/npm/v/select-options.svg?colorB=brightgreen)](https://www.npmjs.com/package/select-options)
[![GitHub package version](https://img.shields.io/github/package-json/v/ux-ui-pro/select-options.svg)](https://github.com/ux-ui-pro/select-options)
[![NPM Downloads](https://img.shields.io/npm/dm/select-options.svg?style=flat)](https://www.npmjs.org/package/select-options)

</div>

<p align="center">SelectOptions replaces standard HTML drop-down lists with custom ones, improving their appearance and user interaction.</p>
<p align="center"><sup>1.5kB gzipped</sup></p>
<p align="center"><a href="https://codepen.io/ux-ui/full/pomJYYr">Demo</a></p>
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
<sub>CSS</sub>
```SCSS
@import "select-options/dist/";
```
<sub>if your bundler supports SCSS</sub>
```SCSS
@import "select-options/src/";
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

&#10148; **API**

|      Name       |    Type    | Description                                                                                                                                                                                                                                                        |
|:---------------:|:----------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `updateSelects` | `function` | Updates the state of all custom selects within the `select-option-container`. This method is useful in situations where the original `<select>` elements have been programmatically changed and the custom select UI needs to be updated to reflect these changes. |
<br>

&#10148; **Options**

|    Option    |   Type    | Default | Description                                                                                                                                                                                                                                                                                            |
|:------------:|:---------:|:-------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `mobileMode` | `boolean` | `false` | When set to true, the mobileMode parameter allows the default behavior of the native select element to be used on mobile devices instead of the custom dropdown functionality. This takes advantage of the native mobile dropdown interfaces, which are typically more user-friendly on touch screens. |
<br>

&#10148; **CSS custom properties**

| Variable                           |    Default    | Description                                                        |
|:-----------------------------------|:-------------:|:-------------------------------------------------------------------|
| `--so-color-outline-inactive`      |  `DarkGray`   | Color of the select border when inactive                           |
| `--so-color-outline-hover`         |  `SlateGrey`  | Color of the select border on hover                                |
| `--so-color-outline-opened`        | `DodgerBlue`  | Color of the select border when opened                             |
| `--so-color-label-inactive`        |    `Gray`     | Color of the label text when the select is inactive                |
| `--so-color-label-opened`          | `DodgerBlue`  | Color of the label text when the select is opened                  |
| `--so-color-label-selected`        |  `DarkGray`   | Color of the label text when an option is selected                 |
| `--so-color-trigger`               |    `Gray`     | Color of the text in the select field (when an option is selected) |
| `--so-color-list-item-inactive`    |    `Gray`     | Color of the text for inactive list items                          |
| `--so-color-list-item-selected`    |    `White`    | Color of the text for selected list items                          |
| `--so-color-scrollbar-thumb`       |   `Silver`    | Color of the scrollbar thumb in normal state                       |
| `--so-color-scrollbar-track`       |    `White`    | Color of the scrollbar track                                       |
| `--so-color-scrollbar-hover`       |    `Gray`     | Color of the scrollbar thumb on hover                              |
| `--so-background-list`             |    `White`    | Background color of the options list                               |
| `--so-background-option-inactive`  |    `White`    | Background color of inactive options                               |
| `--so-background-option-hovered`   | `WhiteSmoke`  | Background color of options on hover                               |
| `--so-background-option-selected`  | `DodgerBlue`  | Background color of selected options                               |
| `--so-border-radius-select`        |    `5.5px`    | Border radius for the select                                       |
| `--so-border-radius-list`          |    `5.5px`    | Border radius for the options list                                 |
| `--so-list-shadow`                 |   Material    | Shadow for the dropdown menu                                       |
| `--select-dropdown-arrow`          | `url( ... )`  | Sets the image for the select dropdown arrow                       |
<br>

&#10148; **License**

select-options is released under MIT license
