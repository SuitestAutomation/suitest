# SMST 2 HTML

A library to convert smst to HTML fragment.

For a complete demo on library usage check out [SuitestAutomation/translate-demo] repo.

Usage example:

```javascript
import {translateTestLineResult} from '@suitest/translate';
import {toHtml} from '@suitest/smst-to-html';

// Fetch data you need to translate, e.g. using Suitest Network API
const testLineDefinition = {/* get line definition somehow */};
const testLineResult = {/* get line definition somehow */};
const appConfig = {/* get app configuration somehow */};

const smst = translateTestLineResult({
    testLine: testLineDefinition,
    lineResult: testLineResult,
    appConfig,
});

const htmlFragmentLine = toHtml(smst);
```

## Output examples

<div class="suitest-test-line__result suitest-test-line__result--warning"><div class="suitest-test-line suitest-test-line--warning"><div class="suitest-test-line__title">Open application at relative URL</div><div class="suitest-test-line__props"><table><tr class="suitest-test-line__props__prop--undefined"><td>relative path</td><td>=</td><td><span class="suitest-test-line__text--input">/docs</span></td></tr></table></div></div><div class="suitest-test-line__result__message">Condition was not met.</div></div>
<div class="suitest-test-line__result suitest-test-line__result--success"><div class="suitest-test-line suitest-test-line--success"><div class="suitest-test-line__title">Run test <span class="suitest-test-line__text--subject">Docs page is open</span></div></div></div>
<div class="suitest-test-line__result suitest-test-line__result--success"><div class="suitest-test-line suitest-test-line--success"><div class="suitest-test-line__title">Assert: Current location timeout <span class="suitest-test-line__text--input">10s</span> </div><div class="suitest-test-line__props"><table><tr class="suitest-test-line__props__prop--success"><td>current location</td><td>=</td><td><span class="suitest-test-line__text--input">https://suite.st/docs/</span></td></tr></table></div></div></div>
<div class="suitest-test-line__result suitest-test-line__result--success"><div class="suitest-test-line suitest-test-line--success"><div class="suitest-test-line__title">Assert: <span class="suitest-test-line__text--subject">Logo</span> timeout <span class="suitest-test-line__text--input">5s</span> </div><div class="suitest-test-line__props"><table><tr class="suitest-test-line__props__prop--success"><td>image</td><td>=</td><td><span class="suitest-test-line__text--input">./../img/suitest-logo-mobile.svg</span></td></tr><tr class="suitest-test-line__props__prop--success"><td>image load state</td><td>=</td><td><span class="suitest-test-line__text--input">loaded</span></td></tr></table></div></div></div>
<div class="suitest-test-line__result suitest-test-line__result--success"><div class="suitest-test-line suitest-test-line--success"><div class="suitest-test-line__title">Send text <span class="suitest-test-line__text--input">test</span> to <span class="suitest-test-line__text--subject">element</span></div></div></div>
<div class="suitest-test-line__result suitest-test-line__result--success"><div class="suitest-test-line suitest-test-line--success"><div class="suitest-test-line__title">Send text <span class="suitest-test-line__text--input">[[Enter]]</span> to <span class="suitest-test-line__text--subject">window</span> until condition is met max <span class="suitest-test-line__text--input">5</span>x every <span class="suitest-test-line__text--input">1s</span></div><div class="suitest-test-line__condition suitest-test-line__condition--success"><div class="suitest-test-line__condition suitest-test-line__condition--success__header">condition: <span class="suitest-test-line__text--subject">Search results container</span> is visible</div></div></div></div>
<div class="suitest-test-line__result suitest-test-line__result--fail"><div class="suitest-test-line suitest-test-line--fail"><div class="suitest-test-line__title">Assert: <span class="suitest-test-line__text--subject">First search result</span> </div><div class="suitest-test-line__props"><table><tr class="suitest-test-line__props__prop--success"><td>text</td><td>contains</td><td><span class="suitest-test-line__text--input">test</span></td></tr><tr class="suitest-test-line__props__prop--fail"><td>text color</td><td>=</td><td><span class="suitest-test-line__text--input">rgb(200, 96, 96)</span></td></tr><tr><td/><td>→</td><td>rgb(240, 96, 96)</td></tr></table></div></div><div class="suitest-test-line__result__message">Condition was not met.</div></div>

[SuitestAutomation/translate-demo]: https://github.com/SuitestAutomation/translate-demo
