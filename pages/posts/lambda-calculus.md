---
title: Lambda Calculus
lang: en
tags: 
  - PL 
  - learning notes
createdAt: 2023-02-21
updatedAt: 2023-02-21
---

Playing with Programming Languages is like playing with Legos. You have some fundamental blocks, build structures, and see what comes out of it. 

Lambda Calculus will be our basic building blocks for now. We'll see what Lambda Calculus is, what fun stuff we can do with it, and what we can extend and build upon it. 

Lambda Calculus consists of terms. You can view terms as sentences of a natural language like English. Terms in the lambda calculus are either variables, abstractions, or applications, and they are defined in a recursive way like the following. 

$$
\begin{equation*} 
    \begin{aligned}
    e &\defsas && x &&& \text{variable} \\
         &\mid && \lc{x}{e} &&& \text{abstraction} \\
         &\mid && \app{e_1}{e_2} &&& \text{application}
    \end{aligned}
\end{equation*}
$$

The $\mid$ bar defines a $\textit{or}$ relationship. The formula above says a term $e$ is defined as either an variable, an abstraction, or an application. The $e$ after the $\defsas$ sign, like the one in $\lc{x}{e}$, is meant to be substituted by the definition of $e$ itself. An example can be found in the next paragraph. The number subscript in the application case doesn't have actual meaning except denoting that the left $e$ and the right $e$ can be different. Only an abstraction can be applied. That is, the left expression in the application has to be an abstraction.  % Therefore, a term can look like a variable name $x$; or it can look an abstraction $\lc{x}{e}$, which is read to be function that takes an input as $x$ and has a body of some term $e$; or a term can be an application $e e$, meaning feeding the second term $e$ as the input to the first term $e$. 
    
Here we give an example of how to recursively derive a term from the definition. Let the term we are creating named $e$. We can choose $e$ to be either a variable, an abstraction, or an application. For complexity, we pick application. We use $\rightsquigarrow$ to denote the derivation. 

$$
\begin{align*}
e &\rightsquigarrow \app{e_1}{e_2} \rightsquigarrow \app{(\lc{x}{e})}{e_2}\\
    &\rightsquigarrow \app{(\lc{x}{e})}{(\lc{y}{e})}\\
    &\rightsquigarrow \app{(\lc{x}{\lc{y}{e}})}{(\lc{y}{e})}\\
    &\rightsquigarrow \app{(\lc{x}{\lc{y}{\app{x}{z}}})}{(\lc{y}{e})}\\
    &\rightsquigarrow \app{(\lc{x}{\lc{y}{\app{x}{z}}})}{(\lc{y}{y})}\\
\end{align*}
$$
    
A variable $x$ can be instantiated from nothing. In the previous example, $z$ is instantiated in the second to last step. The abstraction $\lc{x}{e}$ is read as a function that takes an input, referenced as $x$ for example, and has an body $e$ that may use the input $x$. An application $\app{e_1}{e_2}$ is said to apply the first term $e_1$ to the second term $e_2$.

Some examples of a term in Lambda Calculus can be 
$$
\begin{align}
    x \\
    \lc{x}{y} \\
    \lc{x}{\lc{y}{z}} \\ %\label{eg:lc_eval_order} \\
    \app{(\lc{x}{x})}{y} \\ % \label{eg:lc_par} \\
    \lc{x}{\app{x}{y}} \\ % \label{eg:lc_no_par} \\
    \app{x}{\app{y}{z}} \stackrel{\text{equiv}}{=} (\app{(\app{x}{y})}{z})
\end{align}
$$

Parentheses can be part of the language and can be added to clarify the order of evaluation. Without parenthesis, the order of evaluation goes from left to right and as described in the term definition. For instance, in the third example, equivalent case can be written as "$\lc{x}{(\lc{y}{z})}$". It describes an abstraction parametrized on $x$ whose body is $\lc{y}{z}$. Note that the fourth and the fifth are different terms. The term $\app{(\lc{x}{x})}{y}$ means applying the term $\lc{x}{x}$ on $y$ whereas $\lc{x}{\app{x}{y}}[x][(\lc{y}{z})]$". It describes an abstraction parametrized on $x$ whose body is $\lc{y}{z}$. Note that the fourth and the fifth are different terms. The fourth term means applying the term $\lc{x}{x}$ on $y$ whereas $\lc{x}{\app{x}{y}}$ means an abstraction that takes in an input and returns an application $\app{x}{y}$. 

We can evaluate a term inductively. But before we do that, we need to define several notations so that we can describe the evaluation process.

<definition-block name="Binding and Bound">

Let $e_1$ be a term that may contain the variable $x$. An abstraction $\lc{x}{e_1}$ \textit{binds} the variable $x$ for every occurrence of $x$ in the body $e_1$. The variable is \textit{bound} in $\lc{x}{e_1}$.

</definition-block>

Note that the a variable is bound to the inner most abstraction. For example, in the abstraction $\lc{x}{(\lc{x}{x})}$.

<definition-block name="Free Variables">

Let $e$ be a term in Lambda Calculus. The free variables of $e$ are the variables that are not bound by any abstraction.   % This will come handy when we describe substitutions. 

</definition-block>
    
For example, the variable $y$ is free in both $\lc{x}{y}$ and $y$.

<definition-block name="Substitution">

Let $e_1$ be a term that may contain a free variable $x$. We write $e\subi{e_1}{x}$ to mean that we sub every occurrence of the free $x$ to be the term $e_1$. 
    
A \textit{substitution} $\sigma$ is defined recursively as the following: 
    
$$
\begin{aligned}
    \sigma = \emptyset \mid \sigma[x \subs e]
\end{aligned}
$$

A substitution containing a rule $[x \subs e_1]$ substitutes every occurrences of free $x$ for $e_1$ when applied to some term $e$. That is, when we instantiate the substitution on the term $e$ 

$$
\begin{equation}
    \sigma(e) = e\subi{e_1}{x}
\end{equation}
$$
    
A substitution $\sigma$ can contain any finite amount of substitution rules, %For example, $\sigma = [x\subs e_1, y\subs e_2, \dots]$. 
and variables in a substitution are unique. You can think of a substitution to be a mapping from variables to terms and the domain of a substitution contains no duplicated elements. 

The substitution works in the following recursive way. When the substitution is empty, the term stays intact. That is, $\emptyset(e) = e$. 

Otherwise, 

$$
\begin{align}
    \sigma[x \subs e_1](x) &= \sigma(e_1) \\
    \sigma[x \subs e_1](y) &= \sigma(y) && \text{ if } y \neq x \\
    \sigma[x \subs e_1](\lambda x. e_2) &= \sigma(\lambda x. e_2) \\
    \sigma[x \subs e_1](\lambda y. e_2) &= \sigma(\lambda y. [x \subs e_1](e_2)) &&\text{ if } y \neq x  \text{ and } y \not \in e_1\\
    \sigma[x \subs e_1] (\app{e_2}{e_3}) &= \sigma(\app{([x \subs e_1]e_2)}{([x \subs e_1]e_3)})
\end{align}
$$

When interpreting the preceding rules, the first rule for example, given any substitution $\sigma[x \subs e_1]$ and a term $x$, we substitute $x$ with $e_1$ and then apply the rest of the substitution $\sigma$ on the substituted term following the same rules as before.

</definition-block>

<definition-block name="Alpha Equivalence">

Two terms $e_1$ and $e_2$ are \textit{alpha equivalent} if they are the same up to renaming of bound variables.

</definition-block>

<definition-block name="Single Step Evaluation">

Let $e$ be a term. If there exists a term $e'$ such that $e$ evaluates to $e'$ in one step, we say $e \sgleval e'$

</definition-block>

<definition-block name="Irreduciable">

Let $e$ be a term. If there does not exist a term $e'$ such that $e \sgleval e'$, we say $\irred{e}$.

</definition-block>

<definition-block name="Multi Step Evaluation">

Let $e$ be a term. We define $\muleval$ to be the reflexive and transitive closure of $\sgleval$. That is, the smallest relation such that 

1. if $e \sgleval e'$, then $e \muleval e'$,
2. $e \muleval e$ for all $e$, and
3. if $e \muleval e'$ and $e' \muleval e''$, then $e \muleval e''$. 

We write $e \Downarrow e'$ if and only if $e \muleval e'$.

</definition-block>

