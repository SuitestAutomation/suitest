# Suitest test execution results translation

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/SuitestAutomation/suitest/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@suitest/translate.svg?style=flat)](https://www.npmjs.com/package/@suitest/translate)
[![CircleCI](https://circleci.com/gh/SuitestAutomation/suitest.svg?style=shield)](https://circleci.com/gh/SuitestAutomation/suitest)

This package contains all results that Suitest may return for the test execution and translations for those errors.

Error translations support small subset of Markdown text formatting:

* Bold text `**bold**`
* Code block `` `code` ``
* Hyperlinks `[text](url){attribute: 'value'}`
* Images `![caption](src){attribute: 'value'}`

Messages are split into following categories:

* [Test bootstrap](/packages/translate/docs/bootstrap.md)
* [Test line translations](/packages/translate/docs/testLines.md)

## Using the library

Library provides 2 builds: UMD library is loaded by default when importing
`@suitest/translate` and commonJS is available in case you need to import
specific files. E.g. if you would want to get a list of Suitest message
code you could import `@suitest/translate/commonjs/constants.js`.

The UMD build is isomorphic and already minified. It has one peer dependency - "unist-builder".
Make sure it's either available is node_modules (when running in NodeJS), or as a global "ub" variable in browser.

CommonJS build is not minified and meant to be used with NodeJS (or with bundler).
