```bril
@main {
    a: int = const 5;
    one: int = const 1;
    b: int = add a one;
    a: int = add a b;
    ret a;
}
```
