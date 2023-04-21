---
title: Simply Typed Lambda Calculus
lang: en
tags: 
  - PL 
  - learning notes
createdAt: 2023-02-18
updatedAt: 2023-02-18
display: false
hidden: true
---

This post assumes that you are familiar with the [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) system.

## Simply Typed Lambda Calculus

Python is a dynamic typing language. This means if you don't specify what the variables could possibly be, Python will try to figure it out and only yell at you if it can't. But it's possible to kindly hint Python what the variables are so that it can remind you possible errors before you run the code. In the following code, the function `add` is defined in both untyped and typed version.

```python
def add(a, b):
    return a + b

# can be extended to be 
def add(a: int, b: int) -> int:
    return a + b
```

Lambda calculus can do everything that a Turing machine can do but what if we add types to it? To extend the lambda calculus, we first need to define a type system. Recall that the lambda calculus only has three kinds of expressions: variables, abstractions, and applications. If we want to express the type of an abstraction, we could define it in a mathematical way like $f: A \arwt B$. We want to say that $f$ is a abstraction that maps values of $A$ to values of $B$. But we haven't defined any thing that can be used as an identification for the expressions in the lambda calculus. What's lacking is some base types. Without them, we would have no way to say what kind of creature a variable is. In this example, we can define the base types to be the following: 

$$
\tau_v = \Int \mid \Bool \mid \Unit
$$

$\Int$ is the type of integers; $\Bool$ is the type of boolean values; $\Unit$ is the type of the singleton unit, denoted as $\unit$. Coming with these base types are base values. Base values are the "smallest" elements because they cannot be further reduced. We often say they are _irreducible_.

$$
v = 0 \mid \true \mid \false \mid \unit 
$$ 

We can now define types based on the base types. The definition of all types in this language is as follows: 

$$
\tau = \tau_v \mid \tau_1 \arwt \tau_2 \mid \tau_1 \times \tau_2 \mid \tau_1 + \tau_2
$$

- $\tau_1 \arwt \tau_2$ denotes abstracts that take in an input of type $\tau_1$ and have a body of type $\tau_2$. Note that arrow type is right associative. That is, $\tau_1 \arwt \tau_2 \arwt \tau_3$ is equivalent to $\tau_1 \arwt (\tau_2 \arwt \tau_3)$. And the type $(\tau_1 \arwt \tau_2) \arwt \tau_3$ denotes the abstractions that take in a function of type $\tau_1 \arwt \tau_2$ as input and has a body of type $\tau_3$. 

- $\tau_1 \times \tau_2$ denotes a pair/tuple of type $\tau_1$ and $\tau_2$. For example, $(1, \true)$ is a pair of type $\Int \times \Bool$.

- $\tau_1 + \tau_2$ denotes a sum type of $\tau_1$ and $\tau_2$. Sum type is called Or type sometimes. It's used to denote that an expression can be either a type of $\tau_1$ or a type of $\tau_2$. For example, the following Python function `check` produces a sum type of `int + None`. That is, the output of `check` can be either an `int` or `None`.
  
  ```python
  def check(x: int) -> Union[int, None]:
      if x > 0:
          return x
      else:
          return None
  ```

In the definition, the number subscripts have no meaning except to distinguish different types. That is, in $\tau_1 \times \tau_2$ for example, $\tau_1$ and $\tau_2$ don't have to be the same type. 

With these constructions, we are able to define the simply typed lambda calculus as the following:

$$
\begin{aligned}
e &= x \mid \stlc{x}{\tau}{e} \mid \app{e}{e} \mid v \\
  &\mid (e_1, e_2) \mid \inl e \mid \inr e \\
  &\mid \case{e}{e_1}{e_2} \\
  &\mid \succ n \mid \pred n \mid \iszero n\\
  &\mid \if{b}{e_2}{e_3} \\
  &\mid n + n \mid n - n \\
  &\mid b \land b \mid b \lor b \mid \neg b \\
\end{aligned}
$$

which states that an expression is either a base value, a variable, an abstraction, or an application. Here you can see that the definition of an abstraction is different from the untyped version. The $\tau$ in the abstraction expression is denoting the type of the input variable $x$. For example, $\stlc{x}{\Bool}{x}$ is an identity function that takes in an input of type $\Bool$. 

