```bril transform-rd=rd-simple
@main {
    a: int = const 5;
    one: int = const 1;
    b: int = add a one;
    a: int = add a b;
    ret a;
}
```

<script setup lang="ts">
function flicker(id: string) {
    const el = document.getElementById(id);
    console.log(el, id);

    if (el) {
        el.classList.add('flicker');
        setTimeout(() => {
            el.classList.remove('flicker');
        }, 1500);
    }
}
</script>
