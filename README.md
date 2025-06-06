# Suitest libraries

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/SuitestAutomation/suitest/blob/master/LICENSE)
[![unit tests](https://github.com/SuitestAutomation/suitest/actions/workflows/tests.yml/badge.svg)](https://github.com/SuitestAutomation/suitest/actions/workflows/tests.yml)

This package contains several libraries that [Suitest JavascriptApi] and [Suitest web application] are using.

## Libraries

* [@suitest/translate] - a library for converting server response codes into smst (Suitest flavour of [unist]).
* [@suitest/types] - a library with TypeScript definitions for Suitest test definition and results JSON format.
* [@suitest/smst] - a library with TypeScript definitions for Suitest flavour of [unist] and JSX factory for it.
* [@suitest/smst-to-text] - a translations library to render smst to human-readable text.
* [@suitest/smst-to-html] - a translations library to render smst to human-readable HTML fragment.

## Installation

Run `npm i` (or `npm ci`) to set-up the environment. Lerna's bootstrap command
will be triggered automatically for you to link the packages.

## Building

Since library depend on each other, it's important to run `npm run build` in the root
of this repo before starting to work on the code. Otherwise, unit tests will not work.

[Suitest JavascriptApi]: https://github.com/SuitestAutomation/suitest-js-api
[Suitest web application]: https://the.suite.st
[unist]: https://github.com/syntax-tree/unist
[@suitest/translate]: https://github.com/SuitestAutomation/suitest/tree/master/packages/translate
[@suitest/types]: https://github.com/SuitestAutomation/suitest/tree/master/packages/types
[@suitest/smst]: https://github.com/SuitestAutomation/suitest/tree/master/packages/smst
[@suitest/smst-to-text]: https://github.com/SuitestAutomation/suitest/tree/master/packages/smst-to-text
[@suitest/smst-to-html]: https://github.com/SuitestAutomation/suitest/tree/master/packages/smst-to-html
