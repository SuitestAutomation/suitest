# Suitest test execution results translation

This package contains all results that Suitest may return for the test execution and translations for those errors.

Error translations support small subset of Markdown text formatting:

* Bold text `**bold**`
* Code block `` `code` ``
* Hyperlinks `[text](url){attribute: 'value'}`
* Images `![caption](src){attribute: 'value'}`

Messages are split into following categories:

* [Test bootstrap](docs/bootstrap.md)

## Using the library

Library provides 2 builds: UMD library is loaded by default when importing
`@suitest/translate` and commonJS is available in case you need to import
specific files. E.g. if you would want to get a list of Suitest message
code you could import `@suitest/translate/commonjs/constants.js`.

The UMD build is isomorphic and already minified.

CommonJS build is not minified and meant to be used with NodeJS (or with bundler).
