```bril transform-rd=rd-branch
@main(a: int) {
    zero: int = const 0;
    negative: bool = lt a zero;
    br negative .here .there;
.here:
    five: int = const -5;
    b: int = mul a five;
    jmp .end;
.there:
    b: int = mul a a;
.end:
    print b;
}
```

<script setup lang="ts">
import {inject} from 'vue';
const flicker = inject('flicker');
</script>
