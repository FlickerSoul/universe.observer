#include <iostream>
#include <typeinfo>
#include <boost/core/demangle.hpp>  // enable if you can use boost to demangle the type name


// logics
struct True {
    using val = True;
};

struct False {
    using val = False;
};

template <typename T>
struct Not {};

template <>
struct Not<True> {
    using val = False;
};

template <>
struct Not<False> {
    using val = True;
};

template <typename C, typename T, typename E>
struct If {};

template <typename T, typename E>
struct If<True, T, E> {
    using val = T;
};

template <typename T, typename E>
struct If<False, T, E> {
    using val = E;
};

template <typename T, typename S>
struct And {};

template <typename T>
struct And<False, T> {
    using val = False;
};

template <typename T>
struct And<True, T> {
    using val = T;
};

template <typename T, typename S>
struct Or {};

template <typename T>
struct Or<True, T> {
    using val = True;
};

template <typename T>
struct Or<False, T> {
    using val = T;
};


// numbers
struct Zero {
    using val = struct Zero;
};

template <typename T>
struct Succ {
    using val = struct Succ<T>;
};

template <>
struct Succ<Zero> {
    using val = struct Succ<Zero>;
};


// the size of the board
using N = Succ<Succ<Succ<Succ<Succ<Succ<Zero>>>>>>;


// equality
template <typename T, typename S>
struct Equals {
    using val = False;
};

template <typename T>
struct Equals<T, T> {
    using val = True;
};

// Sadly, the recursive version of Equals does not seem to work.
// Let me know if you know a recursive way to do this.
// template <typename T, typename S>
// struct Equals {};

// template <>
// struct Equals<Zero, Zero> {
//     using val = True;
// };

// template <typename T>
// struct Equals<Zero, T> {
//     using val = False;
// };

// template <typename T>
// struct Equals<T, Zero> {
//     using val = False;
// };

// template <typename T, typename S>
// struct Equals<Succ<T>, Succ<S>> {
//     using val = struct Equals<T, S>::val;
// };


// predessor
template <typename T>
struct Pred {};

template <>
struct Pred<Zero> {};

template <typename T>
struct Pred<Succ<T>> {
    using val = T;
};

// abs difference
template <typename T, typename S>
struct AbsDiff {
    using val = typename AbsDiff<typename Pred<T>::val, typename Pred<S>::val>::val;
};

template <typename T>
struct AbsDiff<Zero, T> {
    using val = T;
};

template <typename T>
struct AbsDiff<T, Zero> {
    using val = T;
};

template <>
struct AbsDiff<Zero, Zero> {
    using val = Zero;
};


// List
struct Nil {
    using val = Nil;
};

template <typename X, typename Xs = Nil>
struct Cons {
    using val = Cons<X, Xs>;
    using x = X;
    using xs = Xs;
};


// If any in the list is true
template <typename L>
struct AnyTrue {
    using val = typename Or<typename L::x, typename AnyTrue<typename L::xs>::val>::val;
};

template <>
struct AnyTrue<Nil> {
    using val = False;
};


// Create a list of numbers from 0 to N
template <typename N, typename Xs = Nil>
struct RangeFromZero {
    using xs = typename RangeFromZero<typename Pred<N>::val, Xs>::val;
    using val = Cons<N, xs>;
};

template <typename Xs>
struct RangeFromZero<Zero, Xs> {
    using val = Cons<Zero, Xs>;
};


// the queen
template <typename X, typename Y>
struct Queen {
    using val = Queen<X, Y>;
    using x = X;
    using y = Y;
};


// representing a row of queen
template <typename Cols, typename row>
struct RowOfQueens {
    using col = typename Cols::x;
    using val = Cons<Queen<col, row>, typename RowOfQueens<typename Cols::xs, row>::val>;
};

template <typename Row>
struct RowOfQueens<Nil, Row> {
    using val = Nil;
};


// check if a queen is threatened by another queen, horizontally, vertically or diagonally
template <typename A, typename B>
struct Threatens {
    using val = typename Or<
        typename Or<
            typename Equals<typename A::x, typename B::x>::val,
            typename Equals<typename A::y, typename B::y>::val
        >::val,
        typename Equals<
            typename AbsDiff<typename A::x, typename B::x>::val,
            typename AbsDiff<typename A::y, typename B::y>::val
        >::val
    >::val;
};


// check if any of the queen is threatening queen Q
template <typename PlacedQueens, typename Q>
struct ThreateningQueens {
    using val = Cons<typename Threatens<typename PlacedQueens::x, Q>::val, typename ThreateningQueens<typename PlacedQueens::xs, Q>::val>;
};

template <typename Q>
struct ThreateningQueens<Nil, Q> {
    using val = Nil;
};


// check if the queen Q is safe
template <typename PlacedQueens, typename Q>
struct Safe {
    using val = typename Not<typename AnyTrue<typename ThreateningQueens<PlacedQueens, Q>::val>::val>::val;
};


// try to add more safe queens to placed queens
template <typename Candidates, typename PlacedQueens>
struct SafeQueens {
    using candidate = typename Candidates::x;
    using val = typename If<
                            typename Safe<PlacedQueens, candidate>::val,
                            Cons<candidate, typename SafeQueens<typename Candidates::xs, PlacedQueens>::val>,
                            typename SafeQueens<typename Candidates::xs, PlacedQueens>::val>::val;
};

template <typename PlacedQueens>
struct SafeQueens<Nil, PlacedQueens> {
    using val = Nil;
};


// next row of queen
template <typename row, typename PlacedQueens = Nil>
struct Next {
    using val = typename SafeQueens<typename RowOfQueens<typename RangeFromZero<N>::val, row>::val, PlacedQueens>::val;
};


// solve the problem
template <typename Candidates, typename row, typename PlacedQueens>
struct Solve;

// solve a row
template <typename row, typename PlacedQueens>
struct SolveNextRow {
    using val = typename Solve<typename Next<Succ<row>, PlacedQueens>::val, Succ<row>, PlacedQueens>::val;
};

// solve all rows
template <typename Candidates, typename row, typename PlacedQueens>
struct Solve {
    using val = typename If<
                            typename Equals<row, N>::val,
                            Cons<typename Candidates::x, PlacedQueens>,
                            typename If<
                                typename Equals<typename SolveNextRow<row, Cons<typename Candidates::x, PlacedQueens>>::val, Nil>::val,
                               typename Solve<typename Candidates::xs, row, PlacedQueens>::val,
                               typename SolveNextRow<row, Cons<typename Candidates::x, PlacedQueens>>::val
                            >::val
                        >::val;
};

template <typename row, typename PlacedQueens>
struct Solve<Nil, row, PlacedQueens> {
    using val = Nil;
};


// THE SOLUTION!
using Solution = typename Solve<typename Next<Zero>::val, Zero, Nil>::val;


// the debug flag
#define DEBUG false


int main() {
    if (DEBUG) {
        std::cout << std::endl;
        std::cout << typeid(Equals<Succ<Zero>::val, Succ<Zero>>::val).name() << std::endl;
        std::cout << typeid(Equals<Zero, Zero>::val).name() << std::endl;
        std::cout << typeid(Equals<Succ<Zero>::val, Zero::val>::val).name() << std::endl;

        std::cout << std::endl;
        std::cout << typeid(AbsDiff<Succ<Zero>::val, Succ<Zero>>::val).name() << std::endl;
        std::cout << typeid(AbsDiff<Zero, Zero>::val).name() << std::endl;
        std::cout << (typeid(AbsDiff<Succ<Succ<Zero>>::val, Zero::val>::val).name() == typeid(Succ<Succ<Zero>>::val).name()) << std::endl;
        std::cout << (typeid(AbsDiff<Succ<Succ<Zero>>::val, Succ<Zero>::val>::val).name() == typeid(Succ<Zero>::val).name()) << std::endl;

        std::cout << std::endl;
        std::cout << (typeid(RangeFromZero<Zero>::val).name() == typeid(Cons<Zero>::val).name()) << std::endl;
        std::cout << (typeid(RangeFromZero<Succ<Succ<Succ<Zero>>>>::val).name() ==
        typeid(Cons<
                    Succ<Succ<Succ<Zero>>>,
                    Cons<
                        Succ<Succ<Zero>>,
                        Cons<
                            Succ<Zero>,
                            Cons<Zero>
                        >
                    >
                >::val).name()) << std::endl;
    }

    std::cout << std::endl;
    std::cout << boost::core::demangle(typeid(Solution).name()) << std::endl;  // demangled type name
    // std::cout << typeid(Solution).name() << std::endl;  // mangled type name

    /*
    *   Cons<
            Queen<Succ<Zero>, Succ<Succ<Succ<Succ<Succ<Succ<Zero>>>>>>>,                    => Queen(1, 6)
        Cons<
            Queen<Succ<Succ<Succ<Zero>>>, Succ<Succ<Succ<Succ<Succ<Zero>>>>>>,              => Queen(3, 5)
        Cons<
            Queen<Succ<Succ<Succ<Succ<Succ<Zero>>>>>, Succ<Succ<Succ<Succ<Zero>>>>>,        => Queen(5, 4)
        Cons<
            Queen<Zero, Succ<Succ<Succ<Zero>>>>,                                            => Queen(0, 3)
        Cons<
            Queen<Succ<Succ<Zero>>, Succ<Succ<Zero>>>,                                      => Queen(2, 2)
        Cons<
            Queen<Succ<Succ<Succ<Succ<Zero>>>>, Succ<Zero>>,                                => Queen(4, 1)
        Cons<
            Queen<Succ<Succ<Succ<Succ<Succ<Succ<Zero>>>>>>, Zero>,                          => Queen(6, 0)
        Nil>>>>>>>
    */

    return 0;
}
