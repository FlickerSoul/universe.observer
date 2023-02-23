---
title: Subtract One With Only Bits Operation In C/++
lang: en
tags: 
  - C++
  - fun
createdAt: 2023-02-22
updatedAt: 2023-02-22
---

In the tutoring session, I was asked to swap the exponent part of a (32-bit) floating point number to be a new value without any arithmetic operations. That is, let $x$ be a floating number in the binary format like the following:

$$
1.\dots\times 2^{\texttt{m}}
$$

; we want to change the exponent $m$ to be some new value $n$. The result of this swapping is 

$$
1.\dots\times 2^{\texttt{n}}
$$

In the IEEE standard, a floating number is represented as 

$$
x = \underbrace{\texttt{\_}}_{\texttt{Sign}}\underbrace{\texttt{\_\_\_\_\_\_\_\_}}_{\texttt{Exponent}}\underbrace{\texttt{\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_}}_{\texttt{Significand}}
$$

We can use a bit mask to extract the exponent part of $x$:

```cpp
union float_bits {
    float f;
    unsigned u;
};

float swap_exp(float f, int8_t exp) {
    union float_bits x;
    x.f = f;
    uint32_t mask = 0x7f800000;
    uint32_t old_exp = x.u & mask;

    // more stuff needs to be done here
    // so that we can swap the old_exp 
    // to be the exp 

    return x.f;
}
```

Recall that the exponent of the binary representation of a floating number needs to be offset by a bias number before it can be the real exponent part in the floating point bit representation. In this case, the bias number is $127$. 

We can simply take the previous code and add the bias number to the new exponent $n$ to get the new exponent part of the floating number. 

```cpp
union float_bits {
    float f;
    unsigned u;
};

float swap_exp(float f, int8_t exp) {
    union float_bits x;
    x.f = f;
    uint32_t mask = 0x7f800000;
    uint32_t old_exp = x.u & mask;
    uint32_t new_exp = exp + 127;

    x.u = (x.u & ~old_exp) | (new_exp << 23); 

    return x.f;
}
```

But NO ARITHMETIC OPERATIONS are allowed. So we can't just add the `exp` with the bias number. We need something trickier here. Ryan and I thought of a solution that uses only bit operations.

For any _positive_ $n$ added with the biased number $127$ is equal to $128 + n - 1$. That is, 

$$
\begin{aligned}
\texttt{0x0111\_1111} + n &= \texttt{0x1000\_0000} + n - 1 \\
&= \texttt{0x1000\_0000 | (n - 1) }
\end{aligned}
$$

Therefore, if we know what $n - 1$ is, we can `&` it with the mask `0x1000_0000`.

So how do we compute $n-1$ without arithmetic operations? Well, 

```cpp
uint32_t sub_one(uint32_t n) {
    uint32_t i;
    for (i = 1; i != (i & n) ; n |= i, i <<= 1) ;
    return n & ~i; 
}
```

When we subtract one from a binary, if the $0$ th place is $0$, we need to burrow from higher places and the $0$ th place with turn to $1$. For example, if we want to subtract one from $1010$, we need to borrow from the $1$st place and the result will be $1001$. This means, when we subtract one from a binary number, we substitute all zeros we see to be $1$ before we see any $1$; then we substitute the first $1$ to be $0$. The `for` loop above does exactly this. It stops when it finds the first $1$ but before that it substitutes any $0$ in `n` to be $1$. After the for loop, we set the first $1$ we saw to be $0$. Then we subtracted $1$! 

For any negative $n$, we can get the real exponent bits by 

$$
(\texttt{0x0111\_1111 \& n}) - 1
$$

So the final code is 

```cpp
union float_bits {
    float f;
    unsigned u;
};

uint32_t sub_one(uint32_t n) {
    uint32_t i;
    for (i = 1; i != (i & n) ; n |= i, i <<= 1) ;
    return n & ~i; 
}

float swap_exp(float f, int8_t exp) {
    union float_bits x;
    x.f = f;
    uint32_t mask = 0x7f800000;
    uint32_t old_exp = x.u & mask;
    uint32_t new_exp = exp == 0 ? 127 : 
                (
                    exp > 0 ? 
                    (0b10000000 | sub_one(exp)) : 
                    sub_one(0b01111111 & exp)
                );

    x.u = (x.u & ~old_exp) | (new_exp << 23); 

    return x.f;
}

int main() {
    float f = 16.0;  // 1.0 * 2^4
    printf(
        "The output is %.5f and the expected output is 32.0\n", 
        swap_exp(f, 5)
    );
    printf(
        "The output is %.5f and the expected output is 0.5\n", 
        swap_exp(f, -1)
    );
    printf(
        "The output is %.5f and the expected output is 1.0\n", 
        swap_exp(f, 0)
    );
    return 0;
}
```

There are `inf` and `nan` but we are not going to deal with them here. 

The code format is not working very well. I will fix it later! :)
