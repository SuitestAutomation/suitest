# Test Lines

Translating test line definitions into human readable language.

## Prerequisites

In order to translate a line, you'll need the following data:

* Line definition, e.g. loaded from feed `/results/{resultId}`.
* Application configuration, e.g. from feed `/test-pack-runs/{testPackRunId}`, see `effectiveAppConfig` property.
    This information is needed because any configuration variables used in test need to be translated.
* Optional, a list of elements used during test execution, so that actual element names could be displayed instead of
    just ids. This information will be available from the feed `/results/{resultId}` shortly.
* Optional, a list of snippets used during test execution, so that actual snippet names could be displayed instead of
    just ids.

Reference the feeds can be found in [our documentation].

## Translating test line definition to a plain text

For example:
```javascript
const {testLineToPlainText} = require('@suitest/translate');

const translateLine = testLineToPlainText({type: 'sleep', timeout: 2000}, appConfiguration);

console.log(translateLine); // Sleep for 2s
```

## Translating test line definition to a formatted text

```javascript
const {testLineToFormattedText} = require('@suitest/translate');

const translateLine = testLineToFormattedText({
    type: 'assert',
    then: 'success',
    condition: {
        subject: {type: 'application'},
        type: 'exited'
    },
}, appConfiguration);

console.log(translatedLine); // Assert: Application has exited
```

## Translating test line definition to a HTML

```javascript
const {testLineToHtml} = require('@suitest/translate');

const translateLine = testLineToHtml({
    type: 'wait',
    then: 'success',
    timeout: 2000,
    condition: {
        subject: {type: 'cookie', val: 'my-cookie'},
        type: '=',
        val: 'test'
    },
}, appConfiguration);

console.log(translatedLine);
```

Output (in HTML):
```html
<figure class="suitest-test-line">
	<figcaption>Assert: Cookie</figcaption>
	<figure class="suitest-test-line__dictionary">
		<dl>
			<dt>Timeout</dt>
			<dd><span class="suitest-test-line__text--bold">2s</span></dd>
		</dl>
	</figure>
	<figure class="suitest-test-line__table">
		<table>
			<tr>
				<td><span class="suitest-test-line__text--bold">my-cookie</span> cookie</td>
				<td>=</td>
				<td><span class="suitest-test-line__text--bold">test</span></td>
			</tr>
		</table>
	</figure>
</figure>
```

In order to apply basic styling, make sure to include `@suitest/translate/suitest-test-line.css` file from
the NPM package into your HTML page.

## Other formats

We are using our own flavour of [unist] AST to translate test lines into multiple formats. Thus, you can implement
your own renderers if provided by default do not fit your needs.

```javascript
const {testLineToAst} = require('@suitest/translate');

const suitestAst = testLineToAst({type: 'sleep', timeout: 2000});

console.log(suitestAst);
```

Would produce:
```json5
{
  type: 'test-line',
  title: [
    {type: 'text', value: 'Sleep for '},
    {type: 'bold', value: '2'},
    {type: 'text', value: 's'},
  ],
}
```

[our documentation]: https://suite.st/docs/suitest-network-api/api-reference/
[unist]: https://github.com/syntax-tree/unist
