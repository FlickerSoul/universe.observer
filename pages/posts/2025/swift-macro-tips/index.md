---
title: Tips on Writing Swift Macros
#subtitle: Why is this so hard?
#abstract:
lang: en
#langs:
tags:
  - Swift
  - Swift Macros
createdAt: 2025-07-19
updatedAt: 2025-07-19
#hidden:
#hasComments:
#wip: false
---

I spent a couple of days writing Swift Macros for my
[`BinaryParseKit`](https://github.com/FlickerSoul/BinaryParseKit), and here is a
list of tips I wish I had when I started. If you're interested in how
`BinaryParseKit` works, you can check
out [this post](/posts/2025/binary-parser-and-macros).

<!-- more --> 

## My Impression On Swift Macros

Writing Swift Macros has been a strange experience to me. Swift Macro is the
first macro I write in AST. My macro experience in C/++ or Rust has been more
toward writing actual code, instead of specifying the AST directly. You can jump
to the [next _Tips_ section](#tips) directly.

Using AST for macro helps you reduce grammatical errors but also introduces many
inconvenience. My biggest enemy was unfamiliarity with the syntax AST. I was
constantly questioning what syntax node I should use in the current context.
My mind jumped in between how I want the generated code to look and what I
need to type to generate it. In contrast, the
[`quote` Rust crate](https://crates.io/crates/quote) allows you
to write almost just code, a far purer writing experience.

```rust
#[proc_macro_derive(Hello)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    // Parse the input tokens into a syntax tree
    let input = parse_macro_input!(input as DeriveInput);
    
    // Get the name of the struct/enum
    let name = input.ident;
    
    quote! {
        impl #name {
            pub fn hello() {
                println!("Hello from {}!", stringify!(#name));
            }
        }
    };
}
```

Swift Macro has quite a lot of restrictions on code generation. The language
categorizes macros into many categories, such
as [freestanding macros](https://github.com/DougGregor/swift-evolution/blob/se-0382-expression-macros-updates/proposals/0382-expression-macros.md)
and [attached macros](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0389-attached-macros.md);
under attached macros, there are `body`, `extension`, `member`, `peer`, etc.
Each category is restricted to generating specific kinds of code. For
instance, freestanding macros cannot generate extension.

```swift
// this will not work
// error: Conformance macros are replaced by extension macros
#conforms(UInt8.self, Int8.self, to: Parsable.self)
```

I need to dig quite a lot of docs and RFCs because XCode's terrible
autocompletion doesn't tell me what possible macro types I can choose. The
lack of clear documentation and quick iterations of APIs makes it worse.
Till today, I still don't know all the options of the attached macro.

## Tips

### Swift AST Explorer

As [recommened by official SwiftSyntax GitHub doc](https://github.com/swiftlang/swift-syntax#documentation),
the [Swift AST Explorer](https://swift-ast-explorer.com/) is a great way to peek
into the AST under the code. I used this website quite a lot to figure out what
syntax I need to extract and what I need to write to generate code.

### `SyntaxBuild` instead of raw strings

When I first landed my hand on Swift Macro, I wrote raw strings, did string
interpolations, and converted them to syntax instances before they raw strings
were returned from macro. For instance,

```swift
public struct Hello: DeclarationMacro {
    public static func expansion(
        of node: some FreestandingMacroExpansionSyntax,
        in context: some MacroExpansionContext
    ) throws -> [DeclSyntax] {
        // #[!code focus:8]
        [
            """
            func hello() {
                print("hello!")
            }
            """
        ]
    }
}
```

Raw strings are not maintainable because it's easy to write typos and also bad
for formatting if you're composing nested blocks of code together.

Instead, using `SyntaxBuild` can help maintain structures and feels more like
writing actual Swift code.

```swift
public struct PrintArguments: DeclarationMacro {
    public static func expansion(
        of node: some FreestandingMacroExpansionSyntax,
        in context: some MacroExpansionContext
    ) throws -> [DeclSyntax] {
        // #[!code focus:8]
        [
            DeclSyntax(
                try FunctionDeclSyntax("func hello()") {
                    "print(\"Hello, World!\")"
                }
            )
        ]
    }
}

```

### `SyntaxVisitor` can be cleaner than `for` loops

I find sometimes it's helpful to make subclasses of `SyntaxVisitor` instead of
looping directly over the children of a syntax node.

`SyntaxVisitor` is a class that allows you to
define `visit` and `visitPost` for any type of syntax, and to use `walk` method
to iterate all children in any syntax entity. This means `SyntaxVisitor` removes
quite a lot of manual type casting and allows you to focus on the specific
types you need.

### Comments may not work as expected

If you'd like to include comments in the generated code, it has to be [trivia of
other statements](https://forums.swift.org/t/swift-syntax-comment-trivia-expected-prefixes/73190).
For instance, the comment declaration in line 6 doesn't appear
in the generated code.

```swift {6}
@CodeBlockItemListBuilder
func generateSkipBlock(variableName _: String, skipInfo: ParseSkipInfo) -> CodeBlockItemListSyntax {
    let byteCount = skipInfo.byteCount
    let reason = skipInfo.reason
    
    "// Skip \(raw: byteCount) because \(reason)"
    "try span.seek(toRelativeOffset: \(raw: byteCount))"
}
```

But if we combine the comment other with its following statements, it
will appear in the generated code:

```swift {6-9}
@CodeBlockItemListBuilder
func generateSkipBlock(variableName _: String, skipInfo: ParseSkipInfo) -> CodeBlockItemListSyntax {
    let byteCount = skipInfo.byteCount
    let reason = skipInfo.reason
    
    """
    // Skip \(raw: byteCount) because \(reason)
    try span.seek(toRelativeOffset: \(raw: byteCount))
    """
}
```

### Simplify macro testing with modern `@Test` from `swift-testing`

When creating a Swift Macro package, XCode prompts if you want to include tests.
Your choice of testing framework is only `XCTest`. However, I prefer the
new [Swift Testing framework](https://developer.apple.com/documentation/testing)
than `XCTest` because its simpler setup. You may also find the example
`XCTest` code to be quite verbose because of the use of `#if` configs. Here is
how to set up Swift Macro testing using the new `Testing` framework.

The example `XCTest` test suite looks like the following.

```swift
import SwiftSyntax
import SwiftSyntaxBuilder
import SwiftSyntaxMacros
import SwiftSyntaxMacrosTestSupport
import XCTest

#if canImport(MyMacroMacros)
import MyMacroMacros

let testMacros: [String: Macro.Type] = [
    "stringify": StringifyMacro.self,
]
#endif

final class MyMacroTests: XCTestCase {
    func testMacro() throws {
        #if canImport(MyMacroMacros)
        assertMacroExpansion(
            """
            #stringify(a + b)
            """,
            expandedSource: """
            (a + b, "a + b")
            """,
            macros: testMacros
        )
        #else
        throw XCTSkip("macros are only supported when running tests for the host platform")
        #endif
    }
}
```

The code uses `assertMacroExpansion` utility from `SwiftSyntaxMacrosTestSupport`
to test macro expansions. Under the hood,
`SwiftSyntaxMacrosTestSupport.assertMacroExpansion` uses
`SwiftSyntaxMacrosGenericTestSupport.assertMacroExpansion` with a default XCTest
implementation of `failureHandler`.

```swift {26}
public func assertMacroExpansion(
  _ originalSource: String,
  expandedSource expectedExpandedSource: String,
  diagnostics: [DiagnosticSpec] = [],
  macroSpecs: [String: MacroSpec],
  applyFixIts: [String]? = nil,
  fixedSource expectedFixedSource: String? = nil,
  testModuleName: String = "TestModule",
  testFileName: String = "test.swift",
  indentationWidth: Trivia = .spaces(4),
  file: StaticString = #filePath,
  line: UInt = #line
) {
  // #[!code focus:19]
  SwiftSyntaxMacrosGenericTestSupport.assertMacroExpansion(
    originalSource,
    expandedSource: expectedExpandedSource,
    diagnostics: diagnostics,
    macroSpecs: macroSpecs,
    applyFixIts: applyFixIts,
    fixedSource: expectedFixedSource,
    testModuleName: testModuleName,
    testFileName: testFileName,
    indentationWidth: indentationWidth,
    failureHandler: {
      XCTFail($0.message, file: $0.location.staticFilePath, line: $0.location.unsignedLine)
    },
    fileID: "",  // Not used in the failure handler
    filePath: file,
    line: line,
    column: 0  // Not used in the failure handler
  )
}
```

To use the new `Testing` framework, we just need to swap the `failureHandler` to
use `Issue.record`. Therefore, we define the following helper function

```swift 
import SwiftSyntaxMacroExpansion
import SwiftSyntaxMacrosGenericTestSupport
import Testing

extension TestFailureLocation {
    var sourceLocation: Testing.SourceLocation {
        Testing.SourceLocation(fileID: fileID, filePath: filePath, line: line, column: column)
    }
}

let macroFailureHandler = { @Sendable (failureSpec: TestFailureSpec) in
    _ = Issue.record(
        Comment(stringLiteral: failureSpec.message),
        sourceLocation: failureSpec.location.sourceLocation
    )
}

func assertMacroExpansion(
    _ originalSource: String,
    expandedSource expectedExpandedSource: String,
    diagnostics: [DiagnosticSpec] = [],
    macros: [String: Macro.Type],
    applyFixIts: [String]? = nil,
    fixedSource expectedFixedSource: String? = nil,
    testModuleName: String = "TestModule",
    testFileName: String = "test.swift",
    indentationWidth: Trivia = .spaces(4),
    fileID: String = #fileID,
    file: StaticString = #filePath,
    line: UInt = #line,
    column: UInt = #column,
) {
    let specs = macros.mapValues { MacroSpec(type: $0) }
    SwiftSyntaxMacrosGenericTestSupport.assertMacroExpansion(
        originalSource,
        expandedSource: expectedExpandedSource,
        diagnostics: diagnostics,
        macroSpecs: specs,
        applyFixIts: applyFixIts,
        fixedSource: expectedFixedSource,
        testModuleName: testModuleName,
        testFileName: testFileName,
        indentationWidth: indentationWidth,
        failureHandler: macroFailureHandler,
        fileID: "",  // Not used in the failure handler
        filePath: file,
        line: line,
        column: 0  // Not used in the failure handler
    )
}
```

We can also swap the `#if` configs to use
[`Trait.disabled`](https://developer.apple.com/documentation/testing/trait) on
`@Suite` or `@Test`. Together, it gives us the following

```swift 
import SwiftSyntax
import SwiftSyntaxBuilder
import SwiftSyntaxMacros
import Testing

#if canImport(MyMacroMacros)
import MyMacroMacros

let testMacros: [String: Macro.Type] = [
    "stringify": StringifyMacro.self,
]
let canImportMacros = true
#else
let testMacros = [String: Macro.Type]()
let canImportMacros = false
#endif

@Suite(.disabled(if: !canImportMacros, "Cannot import macros"))
struct MyMacroTests {
    @Test
    func testMacro() throws {
        assertMacroExpansion(
            """
            #stringify(a + b)
            """,
            expandedSource: """
            (a + b, "a + b")
            """,
            macros: testMacros
        )
    }
}
```
