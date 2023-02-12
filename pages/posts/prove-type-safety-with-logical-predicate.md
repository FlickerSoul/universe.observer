---
title: Prove Type Safety With Logical Predicates
lang: en
tags: 
  - PL 
  - learning notes
createdAt: 2023-02-11
updatedAt: 2023-02-11
---

This post assumes that you are familiar with the [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) system.

## Simply Typed Lambda Calculus (STLC) Overview

Python is a dynamic typing language. This means if you don't specify what the variables could possibly be, Python will try to figure it out and only yell at you if it can't. But it's possible to kindly hint Python what the variables are so that it can remind you possible errors before you run the code. In the following code, the function `add` is defined in both untyped and typed version.

```python
def add(a, b):
    return a + b

# can be extended to be 
def add(a: int, b: int) -> int:
    return a + b
```

Lambda calculus can do everything that a Turing machine can do but what if we add types to it? To extend the lambda calculus, we first need to define a type system. Recall that the lambda calculus only has three constructors: variables, abstractions, and applications. What's lacking is some base types. Without them, we would have no way to say what kind of creature a variable is. We can define the base types to be the following: 

$$
\tau = \Int \mid \Bool \mid \Unit
$$

$\Int$ is the type of integers; $\Bool$ is the type of boolean values; $\Unit$ is the type of the singleton unit, denoted as $\unit$. Coming with these base types are base values. Base values are the "smallest" elements because they cannot be further reduced. We often say they are _irreducible_.

$$
v = 0 \mid \true \mid \false \mid \unit 
$$

With these constructions, we are able to define the simply typed lambda calculus as the following:

$$
e = x \mid \stlc{x}{\tau}{e} \mid \app{e}{e} \mid v
$$