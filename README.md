# angular-adaptive
A hybrid between adaptive and responsive templating. Provides a directive to dynamically load device specific templates in a responsive manner.
## Installation
* Install as a [bower](http://bower.io) dependency using: 
```
bower install angular-adaptive --save
```
* Include the supplied `angular-adaptive.min.js` script to you app.
```html
<script src="bower_components/angular-adaptive/dest/adaptive.min.js"></script>
```
* Add `'angular-adaptive'` as a module dependency in your angular app.
```javascript
angular.module('someApp', ['angular-adaptive']);
```
### Configuration
The **angular-adaptive** can be configured using `adaptiveConfigProvider` in the **config** of your **angular** app module.
```javascript
angular
    .module('someApp', [
        'angular-adaptive'
    ])
    .config(function(adaptiveConfigProvider) {
        adaptiveConfigProvider.config({
            devices: [
                {
                    name: "large",
                    mediaQuery: "screen and (min-width: 1140px)"
                },
                {
                    name: "medium",
                    mediaQuery: "screen and (min-width: 768px) and (max-width: 1280px)"
                },
                {
                    name: "small",
                    mediaQuery: "screen and (max-width: 767px)"
                }
            ]
        });
    });
```
#### Defaults
```javascript
devices: [
    {
        name: "desktop",
        mediaQuery: "screen and (min-width: 768px)"
    },
    {
        name: "mobile",
        mediaQuery: "screen and (max-width: 767px)"
    }
]
```
## Usage
By default, **angular-adaptive** provides two device configurations (`desktop` and `mobile`) based on the screen widths (See [Defaults](#Defaults)). The device names can be used as the attributes of the `adaptive` directive to provide the respective template file to render when the `mediaQuery` of a certain device is matched.
```html
<adaptive desktop="views/desktop/entity.html" mobile="views/mobile/entity.html"></adaptive>
```
# Support
This script uses the [matchMedia](https://github.com/paulirish/matchMedia.js) polyfill to suppport older versions of Internet Explorer.
# License
The MIT License (MIT)

Copyright (c) 2016 Junaid Ilyas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
