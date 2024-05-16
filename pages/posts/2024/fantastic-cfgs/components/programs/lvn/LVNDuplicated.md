```bril {5-6}
@main() {
    a: int = const 4;
    b: int = const 5;

    temp1: int = add a b;
    temp2: int = add a b;

    result: int = mul temp1 temp2;
    print result;
}
```
