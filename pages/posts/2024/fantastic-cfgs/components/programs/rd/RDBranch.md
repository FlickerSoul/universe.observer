```bril {12,13} transform-rd=rd-branch
@main(a: int, b: int) {
    zero: int = const 0;
    negative: bool = lt a zero;
    br negative .here .there;
.here:
    a: int = mul a a;
    b: int = mul a b;
    jmp .end;
.there:
    b: int = mul a a;
.end:
    print b;
    print a;
}
```

<script setup>
import {inject} from 'vue';
const flicker = inject('flicker');
</script>
