---
title: Loops and Phi Nodes
subtitle: CS6120 learning note part 2
#abstract:
lang: en
#langs:
tags:
  - PL
  - compiler
createdAt: 2024-05-16
updatedAt: 2024-05-16
#hidden:
#hasComments:
wip: true
---

This is the part 2 of the CS6120 learning note. This note will introduce natural
loops, loop-invariant code motion, and static single assignments.

<!-- more -->

[[TOC]]

## Credit

This post uses [Bril](https://capra.cs.cornell.edu/bril/intro.html),
an compiler IR for learning. Part of the code used for this post was modified
from Bril.

## Dominance

As we have discussed in the [previous post](/posts/2024/fantastic-cfgs/part1/),
cycles can be formed due to the loops in the program.
Because it is possible for a directed graph to have various
shapes of cycles, and not all kinds of cycles happen to programs easily and are
good for analysis, we define natural loops, which will be an important entity to
work with in future analysis.

Before defining what a natural loop is, we need to identify a couple relations:

- `A` dominates `B` (simplified as `A` DOM `B`): if all paths leading to `B`
  include `A`. It feels like something illustrated below. You can see the
  execution of `B` guarantees the execution of `A`.

  ```mermaid
  stateDiagram-v2
      direction LR
      state "..." as PM
      state "..." as MM
      [*] --> P1
      [*] --> PM
      [*] --> P3
      P1 --> A
      PM --> A
      P3 --> A
      A --> M
      A --> MM
      M --> B
      MM --> B
  ```

  However, the `A` and `B` below do not have the DOM relation, because there is
  a path to `B` from `M` that does not include `A`.

  ```mermaid
  stateDiagram-v2
      direction LR
      state "..." as PM
      state "..." as MM
      state "..." as PPM
      [*] --> PM
      [*] --> PPM
      PM --> M
      PM --> A
      PPM --> A
      A --> MM
      M --> B
      MM --> B
  ```

  Also note that, DOM is a reflexive relation, meaning `X` DOM `X` for every
  basic block `X`.

- `A` strictly dominates `B` (simplified as `A` SDOM `B`): iff `A` DOM `B` and `
  A` $\ne$ `B`. In the first diagram above, `A` and `M` (and many other nodes)
  strictly dominate `B`.
- `A` immediately dominates `B` (simplified as `A` IDOM `B`): iff `A` SDOM `B`
  and `A` does not strictly dominate any node that strictly dominate `B`. In
  other words, `A` is a immediate ancestor of `B`.
- `A`is post dominated by `B` (simplified as `A` PDOM `B`): iff all paths
  from `B` to the exit includes `A`.

<DominanceExamples />

We can use the same data flow framework to find the dominance easily: when
visiting a basic block on CFG, add the identity of the block to combined
information flowed from its predecessors, and pass all to its predecessors; when
combining information, take the intersection of the information from all paths.

## Optimizations

### Loop-Invariant Code Motion

### Static Single Assignment (SSA)
