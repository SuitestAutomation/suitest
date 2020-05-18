# SMST 2 TEXT

A library to convert smst to plain text and formatted text.

For a complete demo on library usage check out [SuitestAutomation/translate-demo] repo.

Usage example:

```javascript
import {translateTestLineResult} from '@suitest/translate';
import {toText} from '@suitest/smst-to-text';

// Fetch data you need to translate, e.g. using Suitest Network API
const testLineDefinition = {/* get line definition somehow */};
const testLineResult = {/* get line definition somehow */};
const appConfig = {/* get app configuration somehow */};

const smst = translateTestLineResult({
    testLine: testLineDefinition,
    lineResult: testLineResult,
    appConfig,
});

const plainTextLine = toText(smst);

// Or if you want a text with ANSI formatting
const formattedTextLine = toText(smst, true);
```

## Output examples

### Plain text

<pre>‼ Open application at relative URL
relative path = /docs
warning: Condition was not met.</pre>
<pre>✔ Run test Docs page is open</pre>
<pre>✔ Assert: Current location timeout 10s 
✔ current location = https://suite.st/docs/</pre>     
<pre>✔ Assert: Logo timeout 5s 
✔ image            = ./../img/suitest-logo-mobile.svg
✔ image load state = loaded                          </pre>
<pre>✔ Send text test to element</pre>
<pre>✔ Send text [[Enter]] to window until condition is met max 5x every 1s
✔ Search results container is visible</pre>
<pre>✖ Assert: First search result 
✔ text       contains test            
✖ text color =        rgb(200, 96, 96)
       →        rgb(240, 96, 96)
fail: Condition was not met.</pre>

### Formatted text

<pre><span style="color: darkorange">‼ </span>Open application at relative URL
relative path = <span style="text-decoration: underline">/docs</span>
<span style="color: darkorange">warning: </span>Condition was not met.</pre>
<pre><span style="color: green">✔ </span>Run test <span style="color: green">Docs page is open</span></pre>
<pre><span style="color: green">✔ </span>Assert: Current location timeout <span style="text-decoration: underline">10s</span> 
<span style="color: green">✔ </span>current location = <span style="text-decoration: underline">https://suite.st/docs/</span></pre>
<pre><span style="color: green">✔ </span>Assert: <span style="color: green">Logo</span> timeout <span style="text-decoration: underline">5s</span> 
<span style="color: green">✔ </span>image   = <span style="text-decoration: underline">./../img/suitest-logo-mobile.svg</span>
<span style="color: green">✔ </span>image load state = <span style="text-decoration: underline">loaded</span>                  </pre>
<pre><span style="color: green">✔ </span>Send text <span style="text-decoration: underline">test</span> to <span style="color: green">element</span></pre>
<pre><span style="color: green">✔ </span>Send text <span style="text-decoration: underline">[[Enter]]</span> to <span style="color: green">window</span> until condition is met max <span style="text-decoration: underline">5</span>x every <span style="text-decoration: underline">1s</span>
<span style="color: green">✔ </span><span style="color: green">Search results container</span> is visible</pre>
<pre><span style="color: darkred">✖ </span>Assert: <span style="color: green">First search result</span> 
<span style="color: green">✔ </span>text contains <span style="text-decoration: underline">test</span>    
<span style="color: darkred">✖ </span>text color =        <span style="text-decoration: underline">rgb(200, 96, 96)</span>
       →        rgb(240, 96, 96)
<span style="color: darkred">fail: </span>Condition was not met.</pre>

[SuitestAutomation/translate-demo]: https://github.com/SuitestAutomation/translate-demo
