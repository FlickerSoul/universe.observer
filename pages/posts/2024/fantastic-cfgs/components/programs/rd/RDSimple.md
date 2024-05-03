```bril {2,5} transform-rd=rd-simple
@main {
    a: int = const 5;
    one: int = const 1;
    b: int = add a one;
    a: int = add a b;
    ret a;
}
```

<script setup lang="ts">
import {inject} from 'vue';
const flicker = inject('flicker');
</script>
