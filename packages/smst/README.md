# SMST

**S**uitest **m**essage **s**yntax **t**ree.

Suitest flavour of the [unist][ext-unist] domain-specific syntax tree, designed
to express test line definitions, results and other user-facing messages. SMST can
be used to render messages in plain text, text with ANSI styling and HTML.

## Nodes

### `Text`

Inline plain text.

```idl
interface Text {
    type: "text"
    value: string
}
```

### `Subject`

Inline text, that represents test line subject name

```idl
interface Subject <: Text {
    type: "subject"
}
```

See [Text][dfn-text].

### `Input`

Inline text, that represents user-defined values in test lines, e.g. expectations.

```idl
interface Input <: Text {
    type: "input"
}
```

See [Text][dfn-text].

### `Code`

Inline code.

```idl
interface Code <: Text {
    type: "code"
}
```

See [Text][dfn-text].

### `Paragraph`

A collection of simple text nodes.

```idl
interface Paragraph {
    type: "paragraph"
    children: InlineText[]
}
```

See [InlineText][dfn-inline-text]

### `CodeBlock`

A block of code.

```idl
interface CodeBlock {
    type: "code-block"
    language: "javascript" | "brightscript"
    value: string
}
```

See [Paragraph][dfn-paragraph].

### `Property`

A single prop in the [properties table][dfn-properties].

```idl
interface Property {
    type: "prop"
    prop: Paragraph
    comparator: string
    expectedValue: Paragraph
    actualValue: [Paragraph | CodeBlock]
    status: ["success" | "failure"]
}
``` 

See [Paragraph][dfn-paragraph] and [CodeBlock][dfn-code-block].

### `Properties`

A simple table, where each row represents a property  

```idl
interface Properties {
    type: "props"
    children: Property[]
}
```

See [Property][dfn-property].

### `Condition`

A test line condition. Could be used in assertions or as a part of conditional line.
For example, `element [my element] exists` is a condition and can be used in such lines:

* `Assert element [my element] exists timeout 2s`
* `Press button OK only if element [my element] exists`

Condition consists of title and optional [Properties][dfn-properties] table. Could
also include result status when rendering test line result. 

```idl
interface Condition {
    type: "condition"
    title: Paragraph
    children: [Properties]
    status: ["success" | "fail"]
}
```

See [Paragraph][dfn-paragraph] and [Properties][dfn-properties].

### `TestLine`

Represent a single Suitest test line.

```idl
interface TestLine {
    type: "test-line"
    title: Paragraph
    children: [(Properties | Condition)[]]
    status: ["success" | "fatal" | "fail" | "warning" | "exit" | "excluded"]
}
```

See [Paragraph][dfn-paragraph], [Properties][dfn-properties] and [Condition][dfn-condition]

### `TestLineResult`

Test line result is a wrapper around [TestLine][dfn-test-line], that also includes execution results
for that line.

```idl
interface TestLineResult {
    type: "test-line-result"
    level: "success" | "fatal" | "fail" | "warning" | "exit" | "excluded"
    children: TestLine
    message: [Paragraph],
    screenhost: [string],
}
```

See [Paragraph][dfn-paragraph] and [TestLine][dfn-test-line]

## Enumeration

### `InlineText`

Any inline text node.

```idl
type InlineText = Text | Subject | Input | Code
```

[ext-unist]: https://github.com/syntax-tree/unist
[dfn-text]: #text
[dfn-paragraph]: #paragraph
[dfn-code-block]: #codeblock
[dfn-inline-text]: #inlinetext
[dfn-test-line]: #testline
[dfn-property]: #property
[dfn-properties]: #properties
