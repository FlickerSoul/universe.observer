```bril
@main {
    one: int = const 1;
    two: int = const 2;
    a: int = const 1;
    b: int = const 5;
    result: int = const 0;
    jmp .loop.cond;
.loop.bump:
    a: int = add a one;
.loop.cond:
    cond: bool = ge a b;
    br cond .end .body;
.body:
    remainder: int = call @mod a two;
    odd: bool = eq remainder one;
    br odd .then .endif;
.then:
    result: int = add result a;
.endif:
    jmp .loop.bump;
.end:
    print result;
}

@mod(a: int, b: int) {
    d: int = div a b;
    dd: int = mul d b;
    r: int = sub a dd;
    ret r;
}
```
