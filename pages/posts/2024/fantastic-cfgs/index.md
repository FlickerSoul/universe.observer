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

A CFG is a direct graph representing the flow of an algorithm, illustrated in
the graph below. We call the (big) nodes of the graph basic blocks (You can use
the [detail toggle](#simple-example) to see more things). Each basic block,
identified by a unique label, is a sequence of instructions. In the following
discussion, when we refer to **local analysis**, we mean the analysis within a
basic block; when we refer to **global analysis**, we mean the analysis within a
function. For example, the analysis within the `start` block is local analysis,
while the analysis on the entire `main` function is global analysis.

When looking at function calls and relationships among functions, we refer as
**interprocedural analysis**. For example, the `call foo` instruction in `main`
function invokes the `foo` function and the analysis using both `main` and `foo`
is interprocedural analysis.

<BranchingInstr id="simple-example"/>

## Local Analysis

## Global Analysis

## Interprocedural Analysis