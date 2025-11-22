---
title: Binary Parser Kit - the journey and lessons learnt about Swift Macro
#subtitle: Why is this so hard?
#abstract:
lang: en
#langs:
tags:
  - Swift
  - Swift Macros
  - swift-binary-parsing
createdAt: 2025-07-18
updatedAt: 2025-07-18
#hidden:
#hasComments:
#wip: false
---

My daily work requires me to work with byte arrays in Swift. Unfortunately,
working directly with pointers and the lack of accessible parsing library make
the work harder.
When Apple released its `swift-binary-parsing` package, offering a safe way to
work with byte buffers, I was excited to try out. This leads to the creation of
[`BinaryParseKit`](https://github.com/FlickerSoul/BinaryParseKit),
a declarative way to deserialize byte arrays. If you're interested in what I
learned on writing Swift Macros, please check
out [this post](/posts/2025/swift-macro-tips).

<!-- more -->

[[TOC]]

## Showcase

> [!IMPORTANT]
> At the time of writing, this package's dependency `swift-binary-parsing` is
> under development and its API may have changed since.

> [!IMPORTANT]
> `BinaryParseKit` is currently under active development and its API may face
> drastic changes.

The source code repository
is [here](https://github.com/FlickerSoul/BinaryParseKit).

Given the following definition of a packet

```text
+----------------------+----------------------+-------------------------------+
| packetIndex (1 byte) | packetCount (1 byte) |     SignalPacket (n bytes)    |
+----------------------+----------------------+-------------------------------+

+------------------------------------------------------------------+
|                         Signal Packet                            |
+---------------------+------------------+-------------------------+
| level (1 bytes)     | id (6 bytes)     | messageSize (1 byte)    |
+---------------------+------------------+-------------------------+
| message (variable, length = messageSize bytes)                   |
+------------------------------------------------------------------+
```

which, defined in Swift, are

```swift
struct BluetoothPacket {
    // 1 byte
    let packetIndex: UInt8
    // 1 byte
    let packetCount: UInt8
    // N bytes
    let payload: SignalPacket
}

struct SignalPacket {
    // 1 byte, but suppose we need `UInt32` for compatibility with other code
    let level: UInt32
    // 6 bytes, signal ID
    let id: UInt64
    // 1 byte for padding
    // 1 byte 
    let messageSize: UInt8
    // N bytes, where N == messageSize
    let message: String
}
```

We can generate parsing automatically by using `BinaryParseKit` macros and
importing `BinaryParing` from `swift-binary-parsing` library:

```swift {5-26} 
import BinaryParseKit 
import BinaryParsing

// #[!code focus:23]
@ParseStruct 
struct BluetoothPacket {
    @parse
    let packetIndex: UInt8
    @parse
    let packetCount: UInt8
    @parse
    let payload: SignalPacket
}

@ParseStruct
struct SignalPacket {
    @parse(byteCount: 1, endianness: .big)
    let level: UInt32
    @parse(byteCount: 6, endianness: .little)
    let id: UInt64
    @skip(byteCount: 1, because: "top padding")
    @parse(endianness: .big)
    let messageSize: UInt8
    @parse(byteCountOf: \Self.messageSize)
    let message: String
}

extension String: SizedParsable {
    public init(parsing input: inout BinaryParsing.ParserSpan, byteCount: Int) throws {
        try self.init(parsingUTF8: &input, count: byteCount)
    }
}
```

We can parse the packet in one line.

```swift
let data: [UInt8] = [
  0x01, // packet index
  0x01, // packet count
  0xAA, // level 
  0xAB, 0xAD, 0xC0, 0xFF, 0xEE, 0x00, // id, little endian
  0x00, // skipped top padding 
  0x0D, // message size
  0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x20, 0x77, 0x6F, 0x72, 0x6C, 0x64, 0x21 // "hello world!"
]

let packet = try BluetoothPacket(parsing: data)
```

The macro generates the following

<details>
<summary>
Extensions
</summary>

`BluetoothPacket`:

```swift
extension BluetoothPacket: BinaryParseKit.Parsable {
    init(parsing span: inout BinaryParsing.ParserSpan) throws(BinaryParsing.ThrownParsingError) {
        @inline(__always) func __assertParsable<T: BinaryParseKit.Parsable>(_ type: T.Type) {
        }
        @inline(__always) func __assertSizedParsable<T: BinaryParseKit.SizedParsable>(_ type: T.Type) {
        }
        @inline(__always) func __assertEndianParsable<T: BinaryParseKit.EndianParsable>(_ type: T.Type) {
        }
        @inline(__always) func __assertEndianSizedParsable<T: BinaryParseKit.EndianSizedParsable>(_ type: T.Type) {
        }
        __assertParsable(UInt8.self)
        self.packetIndex = try .init(parsing: &span)
        __assertParsable(UInt8.self)
        self.packetCount = try .init(parsing: &span)
        __assertParsable(SignalPacket.self)
        self.payload = try .init(parsing: &span)
    }
}
```

`SignalPacket`:

```swift
extension SignalPacket: BinaryParseKit.Parsable {
    init(parsing span: inout BinaryParsing.ParserSpan) throws(BinaryParsing.ThrownParsingError) {
        @inline(__always) func __assertParsable<T: BinaryParseKit.Parsable>(_ type: T.Type) {
        }
        @inline(__always) func __assertSizedParsable<T: BinaryParseKit.SizedParsable>(_ type: T.Type) {
        }
        @inline(__always) func __assertEndianParsable<T: BinaryParseKit.EndianParsable>(_ type: T.Type) {
        }
        @inline(__always) func __assertEndianSizedParsable<T: BinaryParseKit.EndianSizedParsable>(_ type: T.Type) {
        }
        __assertEndianSizedParsable(UInt32.self)
        self.level = try .init(parsing: &span, endianness: .big, byteCount: 1)
        __assertEndianSizedParsable(UInt32.self)
        self.id = try .init(parsing: &span, endianness: .little, byteCount: 6)
        // Skip 1 byte because "top padding"
        try span.seek(toRelativeOffset: 1)
        __assertEndianParsable(UInt8.self)
        self.messageSize = try .init(parsing: &span, endianness: .big)
        __assertSizedParsable(String.self)
        self.message = try .init(parsing: &span, byteCount: Int(self.messageSize))
    }
}
```

</details>

## Background

I had several goals in mind when I started working on this project. They are
minimal for my use case but may not suit the need of general deserialization
scenarios.

- The deserialized object can have fundamental types (`UInt`, `Float`, etc.) as
  well as complex types (`struct`s, `class`es).
- The deserialized object can be an enum of `RawRepresentable` or associated
  values. (currently missing)
- The size of a field in the deserialized object can depend on previous field. (
  e.g. a packet that contains a string whose length is indicated by the first
  byte of the packet).
- The last field could take arbitrary long bytes until the end of the byte
  buffer. (e.g. a packet that consists of a fix sized header and the rest is a
  string payload).
- Deserialization can have a mix of little endian and big endian.
- It's possible to skip bytes during deserialization.

## The Design Process

The idea is straight forward: a attached extension macro `@ParseStruct` that
surveys all the fields in the annotated struct, and synthesize an extension with
an `init`
declaration. Each field in the struct can (optionally) specifying a byte
count and/or an endianness for its deserialization, if the underlying type
supports it. By listing combinations of choices, we have 4 types of parsable
entities, each encoded in a protocol:

- `Parsable` can figure out deserialization of a given byte buffer in absence of
  specific byte count and endianness choice.
- `SizedParsable` needs a specific byte count for deserialization.
- `EndianParsable` needs an endianness for deserialization.
- `EndianSizedParsable` needs both a concrete byte count and an endianness for
  deserialization.

```swift
public typealias Parsable = ExpressiableByParsing
// where `ExpressibleByParsing` is defined in `swift-binary-parsing` as
// public protocol ExpressibleByParsing {
//   @lifetime(&input)
//   init(parsing input: inout ParserSpan) throws(ThrownParsingError)
// }

public protocol SizedParsable {
    @lifetime(&input)
    init(parsing input: inout ParserSpan, byteCount: Int) throws(ThrownParsingError)
}

public protocol EndianParsable {
    @lifetime(&input)
    init(parsing input: inout ParserSpan, endianness: Endianness) throws(ThrownParsingError)
}

public protocol EndianSizedParsable {
    @lifetime(&input)
    init(parsing input: inout ParserSpan, endianness: Endianness, byteCount: Int) throws(ThrownParsingError)
}
```

For instance, `UInt8` would conform to `Parsable` only; on the other hand,
`UInt32` would conform to `EndianSizedParsable` and `EndianParsable` if users
want to parse `4` bytes.

For each protocol, there is at least one noop `@parse` peer macro for annotating
it:

- `Parsable`: `@parse`
- `SizedParsable`: `@parse(byteCount: ByteCount)` and
  `@parse(byteCountOf: KeyPath<R, V>)`
- `EndianParsable`: `@parse(endianness: Endianness)`
- `EndianSizedParsable`: `@parse(byteCount: ByteCount, endianness: Endianness)`
  and `@parse(byteCountOf: KeyPath<R, V>, endianness: Endianness)`

The noop macro itself implementation is

```swift
public struct ByteParsingMacro: PeerMacro {
    public static func expansion(
        of _: SwiftSyntax.AttributeSyntax,
        providingPeersOf _: some SwiftSyntax.DeclSyntaxProtocol,
        in _: some SwiftSyntaxMacros.MacroExpansionContext
    ) throws -> [SwiftSyntax.DeclSyntax] {
        []
    }
}
```

In addition, we allow users to use `@skip(byteCount: Int, because: String)` to
specify skipped bytes before preceding with parsing. The implementation of
`@skip` is also a noop macro. The `because` labeled argument is used to annotate
the reason of skipping those bytes, serving as a documentation purpose.

## Discussion and Future Direction

### `enum` Parsing

It feels important to implementation code generation macros for enum as
well. Since each enum case is disjoint from the others in the same enum, it
would be clear to use `@match` noop macro as an annotation for each enum case.

#### Match By Byte(s)

We can introduce `@match(byte:)` and `@match(bytes:)` to match by the content in
a byte buffer. In addition, we can offer a `@matchElse(takingBytes:)` that
matches previously
unmatched cases; in the case when exact matching fails and no
`@matchElse` is specified, a error would be thrown.

For instance, the following `DiagnosticLevel` has three cases, `error`,
`warning`, and `note`. If the first byte in the byte buffer is `0x01`, then we
conclude it's the `.error` case; if the first two bytes are `0xAA_BB`, we
conclude it's the `.warning` case; otherwise, we take 4 bytes and conclude it's
the `.note` case.

```swift
@ParseEnum
enum DiagnosticLevel: UInt8 {
    @match(byte: 0x01, take: true)
    case error
    
    @match(bytes: [0xAA, 0xBB], take: true)
    case warning
    
    @matchElse(takingBytes: 4)
    case note
}
```

In the case of enums with associated values, we allow the associated values to
be parsed from the remaining byte buffer after matching.

```swift
@ParseEnum
enum DiagnosticLevel {
    @match(byte: 0x01, take: true)
    @parse(byteCount: 0x10)
    case error(message: String)
    
    @match(bytes: [0xAA, 0xBB], take: true)
    @parse(byteCount: 6, endianness: .little)
    case warning(ID: UInt64)

    @matchRemaining(takingBytes: 4)
    @parseRest
    case note(message: String)
}
```

#### Match By Length

We can use `@match(byteCount:)` to indicate matching enum cases by remaining
buffer size. This is useful when cases can be distinguished by the length of
byte buffers. We can also introduce `@matchElse` to match uncovered length size,
and similarly, exact matching failure in absence of `@matchElse` would throw an
error.

For instance, suppose a response byte buffer has three distinct cases: success,
channel failure, unknown failure, and they have the following structure

- success will yield a list of `(lat: Float, long: Float)` tuples whose size is
  guaranteed to be greater than 0.
- channel failure will yield a `UInt32` channel ID.
- unknown failure will yield a `UInt8` error code.

```swift
@ParseEnum
enum Response {
    typealias Loc = (lat: Float, long: Float)
    typealias Locs = [Loc]
    typealias ChannelID = UInt32
    typealias ErrorCode = UInt8

    @matchElse
    @parse
    case success(Locs)
    
    @match(byteCount: MemoryLayout<ChannelID>.size)
    @parse(endianness: .big)
    case channelFailure(id: ChannelID)
    
    @match(byteCount: MemoryLayout<ErrorCode>.size)
    @parse
    case unknownError(code: ErrorCode)
}
```

### `parseRest` in nested scope

Suppose I have two `struct`s like the following

```swift
struct Inner {
    @parseRest
    let string: String
}

struct Outer {
    @parse
    let inner: Intter

    @parseRest
    let message: String
}
```

It's possible `@parseRest` is used twice without compile-time/run-time
enforcement or diagnostics. It may be
possible that we use some sort of static variable (or
[integer generic parameters](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0452-integer-generic-parameters.md)?)
to record the number of `@parseRest` in the nested chain and throw when there
are more than one.

```swift
protocol PossessingParseRest {
    static var possessionCount: Int { get }
    static var totalPossessionCount: Int { get }
    
    @inline(__always)
    static func getTotalPossessionCount<E: PossessingParseRest>(of entity: E.Type) -> Int {
        entity.totalPossessionCount
    }
    
    @inline(__always)
    static func getTotalPossessionCount<E>(of entity: E) -> Int {
        0
    }
}

extension Inner {
    static var possessionCount: Int { 1 }
    static var totalPossessionCount: Int { possessionCount + 0 } 
}

extension Outer {
    static var possessionCount: Int { 1 }
    static var totalPossessionCount: Int { possessionCount +  getTotalPossessionCount(Inner.self) } 
}
```

### Verbose API

At this moment, it takes a lot of typing to specify parsing, such as
`@ParseStruct`/`@ParseEnum`, and
`@parse(byteCount: 1, endianness: .little)`.

It would be nice to provide a master `@Parse` macro that can process all
possible types of objects, and provide users
with convenient helpers to increase the chance of an autocomplete, such as
providing `@parseBigEndian`. Honestly, I can't think of an elegant API off the
top of my head and doesn't quite know what design direction I should take. If
you have any suggestions, I would appreciate if you can share.
