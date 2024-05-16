---
title: Prove Strong Normalization With Logical Predicates
lang: en
tags:
  - PL
  - learning notes
createdAt: 2023-02-11
updatedAt: 2023-02-11
display: false
hidden: true
---

This post assumes that you are familiar with the [lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) and the [simply typed lambda calculus](https://en.wikipedia.org/wiki/Simply_typed_lambda_calculus).

## Simply Typed Lambda Calculus Overview

Let's consider a simply typed lambda calculus system with base types $\Int$ and $\Bool$, and base values of $0$, $\true$, $\false$. The type system is defined as follows:

$$
\tau = \Int \mid \Bool \mid \Unit \mid \tau_1 \arwt \tau_2 \mid \tau_1 \times \tau_2 \mid \tau_1 + \tau_2
$$

The expressions are defined as follows:

$$
\begin{aligned}
v &= 0 \mid \true \mid \false \mid \unit \\
e &= v \mid x \mid \lambda x: \tau. e \mid \app{e_1}{e_2} \\
&\mid \if {e_1} {e_2} {e_3}  \\
&\mid (e_1, e_2) \mid \fst e \mid \snd e \\
&\mid \inl e \mid \inr e \mid \case {e} {e_1} {e_2} \\
&\mid \succ n \mid \pred n \mid \iszero n \mid n_1 + n_2 \mid n_1 - n_2\\
&\mid b \land b \mid b \lor b \mid \neg b\\
\end{aligned}
$$

The typing rules are defined as follows:
