```bril
@main {
    x: int = const 1;
    five: int = const 5;
    y: int = add x five;
    jmp .branching;
    z: int = const 0;
.branching:
    call @foo y;
    ret y;
}

@foo(x: int) {
    print x;
}
```
