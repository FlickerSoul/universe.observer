---
title: Fantastic CFGs and Their Optimizations
subtitle: CS6120 learning note part 1
#abstract: 
lang: en
#langs: 
tags:
  - PL
  - compiler
createdAt: 2024-04-20
updatedAt: 2024-04-20
#hidden: 
#hasComments:
wip: true
---

I have been following and finished
the [CS6120](https://www.cs.cornell.edu/courses/cs6120/2023fa/) from Cornell, a
self-guided online course for topics in compilers. It was a great journey
following along the course and the exercises. This post will be the first of my
dump of learning notes for this course.
<!-- more -->

[[TOC]]

## Credit

This post uses [Bril](https://capra.cs.cornell.edu/bril/intro.html),
an compiler IR for learning. Part of the code used for this post was modified
from Bril.

## Introduction

It takes many stages to compile a piece of code: first the code needs to be
parsed from pure strings into defined
[lexical tokens](https://www.wikiwand.com/en/Lexical_token); then tokens are
transformed into structured data like
[abstract syntax trees (ASTs)](https://www.wikiwand.com/en/Abstract_syntax_tree);
[semantics](https://www.wikiwand.com/en/Semantics_(computer_science)) are given
based on the ASTs, often in the form of
[intermediate representations (IRs)](https://www.wikiwand.com/en/Intermediate_representation);
in the end, we eventually get
[machine code](https://www.wikiwand.com/en/Machine_code) that can be run
efficiently.

In each stage of compilation, we are using the different representation to
express a computer program. Here we focus on the semantics side of the programs
and how we can optimize the programs without changing the semantics of the
programs. To do this, we need another representation not mentioned above. that's
We want the abstract to be more than structured data and to help us analyze the
flow of the program, or how the program executes. This is where
[control flow graphs (CFGs)](https://www.wikiwand.com/en/Control-flow_graph)
come in.

<script setup>
import DCERedef from './components/programs/dce/DCERedef.vue';
import DCEUnused from './components/programs/dce/DCEUnused.vue';
import DCENative from './components/programs/dce/DCENative.vue';
import DCEMultiPass from './components/programs/dce/DCEMultipass.vue';


import {ref} from 'vue'; 

const dce = ref(null);

const cycleCompMapping = {
    'dce': [DCERedef, DCEUnused, DCENative, DCEMultiPass]
};

function browseCycle(comp, count) {
    comp.value.display(count - 1);
}

function browseDCE(count) {
    browseCycle(dce, count)
}
</script>

## CFG, Local | Global | Inter-procedural Optimization

A CFG is a direct graph representing the flow of an algorithm, illustrated in
the graph below. We call the (big) nodes of the graph basic blocks (You can use
the [detail toggle](#branching-instr) to see more things). Each basic block,
identified by a unique label, is a sequence of instructions. In the following
discussion, when we refer to **local analysis**, we mean the analysis within a
basic block; when we refer to **global analysis**, we mean the analysis within a
function. For example, the analysis within the `start` block is local analysis,
while the analysis on the entire `main` function is global analysis.

When looking at function calls and relationships among functions, we refer as
**interprocedural analysis**. For example, the `call foo` instruction in `main`
function invokes the `foo` function and the analysis using both `main` and `foo`
is interprocedural analysis.

<BranchingInstr id="branching-instr" />

It is possible to have cycles in the graph, corresponding to loops in the
program. For example, the program below computes `2^n` in a loop. The graph of
the basic blocks form a loop from the `.loop.enter` to `.loop.body` and then
back to `.loop.enter`.

<SimpleProgram />

## Forward | Backward Analysis

Note that even though the control flow graphs are directed graphs, it is
possible to
[analyze the program from the beginning or from the end](https://www.wikiwand.com/en/Data-flow_analysis).
They are called **forward analysis** and **backward analysis**, respectively.

## Optimizations

### Dead Assignment Elimination

[Dead code](https://www.wikiwand.com/en/Dead_code)can be loosely understood as
code that's not used or executed in runtime. In this section, we focus on
assignments creating redundant variables that are not used in the program.

In the <c @click="browseDCE(1)">first</c> example, the
highlighted line defines `a`, which invalidates a re-definition of `a` in the
next line. This means the highlighted `a` is never going to be used and can be
counted as dead code.

In the <c @click="browseDCE(2)">second</c> example, the highlighted
line defines `c` which isn't used anywhere after its definition. This can be
counted as dead code as well.

However, if we natively check if an assignment happens again before the variable
is used, we could be wrong. In the <c @click="browseDCE(3)">third</c> example,
the variable `a` defined in line 2 is redefined but not used in line 7, and thus
can be counted as dead code and eliminated. However, if we look at the code more
carefully, it we can see that the redefinition happens conditionally, and it is
unclear at compile time which path the program is going to take. This means it
is possible to use both definition of `a` at line 12.

<ProgCycle :progs="cycleCompMapping['dce']" ref="dce"/>

Well, how can we optimize dead code assignment properly? It is clear that using
local information within one basic block isn't enough, because we cannot know
for sure if the variable defined in one basic block is going to be used anywhere
later in the program. This judgement urges us to look at the program globally
and use global analysis, looking among all the basic blocks and all the
instructions within one function.

It is possible that an elimination of one variable can introduce more dead
assignments. In the <c @click="browseDCE(4)">fourth</c> example, we can see that
the variable `y` defined in line 6 is a dead assignment; removing the
variable `y` makes the variable `c` a dead assignment, for `c` is only used when
defining `y`. To solve this problem, we can simply run elimination for multiple
passes until the result converges.

We can formulate algorithm into two steps:

1. the identification of dead assignments: identify the assignments
   that are not used in any path until the function ends or until it is
   redefined.
2. remove those assignments, repeat from previous step until no dead assignment
   is found

### Local Value Numbering

Local value numbering comes in handy when we are dealing with aliases. 
