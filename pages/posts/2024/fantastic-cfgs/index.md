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
import {DCECycle} from './components/programs/dce';
import {LVNCycle} from './components/programs/lvn';
import {RDCycle} from './components/programs/rd';

import {ref, provide} from 'vue'; 

const dce = ref(null);
const lvn = ref(null);
const rd = ref(null);

function browseCycle(comp, count) {
    comp.value.display(count - 1);
}

function browseDCE(count) {
    browseCycle(dce, count)
}

function browseLVN(count) {
   browseCycle(lvn, count)
}

function browseRD(count) {
   browseCycle(rd, count)
}

function flicker(id) {
    const el = document.getElementById(id);

    if (el) {
        el.classList.add('flicker');
        setTimeout(() => {
            el.classList.remove('flicker');
        }, 1500);
    }
}

provide('flicker', flicker)
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

## Natural Loops

As we have discussed, cycles can be formed due to the loops in the program.
Because it is possible for a directed graph to have various shapes of cycles,
and not all kinds of cycles happen to programs easily and are good for analysis,
we define natural loops, which will be an important entity to work with in
future analysis. You can skip this part until you reach the loop-invariant
code motion section and the static single assignment section in the
optimizations.

Before defining what a natural loop is, we need to identify a couple relations:

- `A` dominates `B` (simplified as `A` DOM `B`): if all paths leading to `B`
  include `A`. It feels like something illustrated below:

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

<Dominance />

## Optimizations

### Reaching Definition And Flow Analysis Framework

This is rather a toolkit instead of an optimization. To understand this
framework, we need several terminologies.

- A definition (of a variable) is an instruction that writes value to a (the)
  variable; thus every instruction that writes to a variable is a definition.
- A use of variables is when the instruction uses the variables.
- An available definition at a given point in the program is a definition
  reaches the given point.
- A kill of a definition (of a variable) happens when a new definition (of the
  variable) is available.

Using the terminologies above, we can formulate the reaching definition problem
as: when a variable is used at a point in the problem, which definitions of the
variable are still available at the point.

In the following two examples, you can hover on the used variable name (in the
instruction arguments) and see in the dropdown what the reaching definitions of
the variable are. You can also click on the numbers to highlight where the
definition is.

<ProgCycle :progs="RDCycle" ref="rd" />

In the <c @click="browseRD(1)">first</c> example, the definition of `a` at line
5 kills the
definition of `a` at line 2. Thus, before line 5, when `a` is used to
construct `b`, the reaching definition is the instruction at line 2; after line
5, when `a` is used in the return instruction, the reaching definition is newer
instruction at line `5`.

In the <c @click="browseRD(2)">second</c> example, there are two reaching
definitions for variable `a` and `b`, respectively, when they are used in the
highlighted line. This CFG shows this clearly: there are two paths to get to the
highlighted lines and in each path there is a definition of different of `a`
and `b`. Check the hover dropdown to see where the definitions are!

Since we are trying to identify how far the definition has survived along the
function's execution, it is natural to use forward analysis and have do book
keeping on definitions of variables after each execution of an instruction in
the problem.

The general idea of the algorithm of identifying reaching definition relies on
the observation that a new definition of a variable kills all previous
definitions of the variable, for a variable can only store one value thus only
allow one write at a time. The immediately next instruction and the all the
instructions come after the new definition will use the new definition,
until a newer definition is established. When we are doing note keeping for each
instruction, it would be nice to know what has been made available before the
execution of the instruction; this means if the instruction creates a new
definition, we just need to update the note and pass it to next instruction,
because after the execution of the instruction, the corresponding variable will
have new definition; when the instruction only uses variables, we just need to
pass the note as it is, since no new definitions need to be kept.

The previous description shows how the note is populated with definitions and
how a definition is killed and repopulated. We can see how the information
is generated, flows, and changes from the start of the function til the end.

However, we are missing a subtle thing for the algorithm to
work correctly: how notes from different paths are combined, an scenario
illustrated in the <c @click="browseRD(2)">second</c> example. When there are
many paths to get to an instruction, each path is likely to have a note of
definitions. For instance, in the <c @click="browseRD(2)">second</c> example,
both paths have defined variable `a` independently. It is natural to take a
union of all the notes since we want to know all the definitions that have
survived until the instruction.

In general, an flow analysis on CFGs can be done if three things are specified
for a instruction:

- initial information for the instruction
- how information flowed into the instruction is combined, along with the
  initial information
- how information is generated and killed

Then, with the help from a general solver, which can take this information and
produces the final results, we can obtain our solution with less boilerplate.

We can formulate the reaching definition using the framework above. The
information flow among the instructions is a mapping from variable names to a
set of lines of available definitions. A mapping will be denoted in set
notation, where the keys are unique variable names and the values are a set of
line numbers where the reaching definitions originate.

- Initial information are $\emptyset$ (empty mappings) except the first
  instruction
  in the function: the first instruction contains definitions that defines
  function arguments.
- Let $R_{\text{in}}^i$ denote the information flowing from the $i$th
  predecessor of the instruction. Then the combined result
  is $R_{\text{in}} = \cup_i R_{\text{in}}^i$, where the union ($\cup$) notation
  means merging two mappings into a single mapping in which a key (variable
  name) is mapped to the union of the values (sets of line numbers) from the two
  mappings.
- If the instruction writes to a variable named $k$ and has line number $n$,
  then the information flowing
  out is $R_\text{out} = R_\text{in} \setminus \{k\} \cup \{k \to [n]\}$.
- If the the instruction does not write to any variable, then the information
  flowing out is $R_\text{out} = R_\text{in}$.

### Dead Assignment Elimination

[Dead code](https://www.wikiwand.com/en/Dead_code) can be loosely understood as
code that's not used or executed in runtime. In this section, we focus on
assignments creating redundant variables that are not used in the program.

In the <c @click="browseDCE(1)">first</c> example, the
highlighted line defines `a`, which is invalidated by a re-definition of `a` in
the next line. This means the highlighted `a` is never going to be used and can
be counted as dead code.

In the <c @click="browseDCE(2)">second</c> example, the highlighted
line defines `c`, which isn't used anywhere after its definition. This can be
counted as dead code as well.

However, if we natively check if an assignment happens again before the variable
is used, we could be wrong. In the <c @click="browseDCE(3)">third</c> example,
the variable `a` defined in line 2 is redefined but not used in line 7, and thus
can be counted as dead code and eliminated. However, if we look at the code more
carefully, it we can see that the redefinition happens conditionally, and it is
unclear at compile time which path the program is going to take. This means it
is possible to use both definition of `a` at line 12.

<ProgCycle :progs="DCECycle" ref="dce"/>

Well, how can we optimize dead code assignment properly? It is clear that using
local information within one basic block isn't enough, because we cannot know
for sure if the variable defined in one basic block is going to be used anywhere
later in the program. This judgement urges us to look at the program globally
and use global analysis, looking among all the basic blocks and the
transitions (arrow) among them within one function.

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

We can also use the data flow framework discussed in the previous section.

### Local Value Numbering

Local value numbering comes in handy when we are dealing with aliases and
identical values. To illustrate what the problems we are optimizing look like,
consider the following examples:

In <c @click="browseLVN(1)">first</c> program below, we can quickly
realize that the final return value, after being copied 3 times, is the same as
the variable `a`. It is wasteful to copy the same thing multiple times.
Unfortunately, our dead assignment optimization cannot eliminate this because
every variable is used: `a` is used for initializing `b`, `b` for `c`, `c`
for `d`, and then `d` is eventually used in the `print` call. This problem is
referred as copy propagation.

In the <c @click="browseLVN(2)">second</c> program, we can see that the values
of `temp1` and `temp2` are the same. The program works, but it is not efficient
because the same computation yielding the same value happens twice. It would be
nice to identify unique values and reduce duplicated computations. This problem
is referred as common subexpression elimination.

<ProgCycle :progs="LVNCycle" ref="lvn" />

To provide these kinds of the optimizations, we can identify each value with a
number instead of their canonical names, and point their canonical names to the
numbers. Whenever a variable is assigned, denote it's value as a number and
points the variable to the number; whenever a variable is used, query the number
associated with the variable, and try use the value instead of variable.

