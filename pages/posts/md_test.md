---
title: Test Markdown
createdAt: 2023-02-05
lang: en
tags: 
 - A
 - B
 - C
---

[[toc]]


Basic Formatting
=======================================================================================
Text formatting:

| source                                                            | target                                                   |
|-------------------------------------------------------------------|----------------------------------------------------------|
| `**bold**`                                                        | **bold**                                                 |
| `__bold__`                                                        | __bold__                                                 |
| `*italic*`                                                        | *italic*                                                 |
| `_italic_`                                                        | _italic_                                                 |
| `~~strikethrough~~`                                               | ~~strikethrough~~                                        |
| <code>`inline code`</code>                                        | `inline code`                                            |
| <code><code lang=C++>if (inlinedHighlight == "yes") {</code></code> | <code lang="C++">if (inlinedHighlight == "yes") {</code> |
| `[news](https://cbc.ca)`                                          | [news](https://cbc.ca)                                   |
| `https://casual-effects.com`                                      | https://casual-effects.com                               |
| `morgan@casual-effects.com`                                       | morgan@casual-effects.com                                |
| `5 kg/m^3^`                                                       | 5 kg/m^3^                                                |
 | `H~2~0` | H~2~0| 
| `5 degrees`                                                       | 5 degrees                                                |
| `x<sub>below</sub>`                                               | x<sub>below</sub>                                        |
| `<small>size</small>`                                             | <small>size</small>                                      |
| `<big>size</big>`                                                 | <big>size</big>                                          |


Code Fence
=======================================================================================

```CPP
if (inlinedHighlight == "yes") {
    // ...
}
```

```python
if inlinedHighlight == "yes":
    # ...
```

```javascript
if (inlinedHighlight == "yes") {
    // ...
}
```

```java
if (inlinedHighlight == "yes") {
    // ...
}
```

Latex 
========

Inline: $x^2 + y^2 = z^2$

Block:
$$ x^2 + y^2 = z^2 $$
