```bril
@main {
    i: int = const 0;
    x: int = const 1;
    term: int = const 5;
    zero: int = const 0;
    one: int = const 1;
.loop.enter:
    y: int = sub term i;
    cond: bool = gt y zero;
    br cond .loop.body .loop.end;
.loop.body:
    x = add x x;
    i = add i one;
    jmp .loop.enter;
.loop.end:
    print x;
    ret zero;
}
```
