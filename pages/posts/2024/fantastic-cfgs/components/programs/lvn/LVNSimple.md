```bril {3-5} transform-lvn
@main {
    a: int = const 2;
    b: int = id a;
    c: int = id b;
    d: int = id c;
    print d;
}
```
