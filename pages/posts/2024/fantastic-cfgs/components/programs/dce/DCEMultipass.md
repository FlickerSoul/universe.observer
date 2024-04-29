```bril {4,6}
@main {
    a: int = const 1;
    b: int = const 2;
    c: int = const 3;
    x: int = add a b;
    y: int = add b c;
    ret x;
}
```
