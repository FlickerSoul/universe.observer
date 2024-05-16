```bril
@main {
    x: int = const 1;
    y: int = const 2;
    b1: bool = gt x y;
    br b1 .main.path .side.path;
.side.path:
    print b1;
.main.path:
    z: int = const 3;
    b2: bool = gt z x;
    br b2 .main.s .main.f;
.main.f:
    print b2;
    jmp .end;
.main.s:
    print x;
.end:
    ret y;
}
```
