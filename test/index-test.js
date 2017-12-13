/** ******************************************************************************************************************
 * @file Description of file here.
 * @author Julian Jensen <jjdanois@gmail.com>
 * @since 1.0.0
 * @date Sun Dec 10 2017
 *********************************************************************************************************************/
"use strict";

const
    { DFS } = require( 'traversals' ),
    expect = require( 'chai' ).expect,
    { iterative: iter, yalt, frontiers_from_preds, frontiers_from_succs, reverse_flow } = require( '../index' ),
    rg = `          ┌─────────┐
┌─────────┤ START 0 │
│         └────┬────┘
│              │
│              V
│            ┌───┐
│     ┌──────┤ 1 │
│     │      └─┬─┘
│     │        │
│     │        V
│     │      ┌───┐
│     │      │ 2 │<───────────┐
│     │      └─┬─┘            │
│     │        │              │
│     │        V              │
│     │      ┌───┐            │
│     └─────>│   │            │
│     ┌──────┤ 3 ├──────┐     │
│     │      └───┘      │     │
│     │                 │     │
│     V                 V     │
│   ┌───┐             ┌───┐   │
│   │ 4 │             │ 5 │   │
│   └─┬─┘             └─┬─┘   │
│     │                 │     │
│     │                 │     │
│     │      ┌───┐      │     │
│     └─────>│ 6 │<─────┘     │
│            │   ├────────────┘
│            └─┬─┘
│              │
│              V
│            ┌───┐
│            │ 7 │
│            └─┬─┘
│              │
│              V
│         ┌─────────┐
└────────>│  EXIT 8 │
          └─────────┘
`,

testGraph = [
        [ 1, 8 ],    // start
        [ 2, 3 ],    // a
        [ 3 ],       // b
        [ 4, 5 ],    // c
        [ 6 ],       // d
        [ 6 ],       // e
        [ 7, 2 ],    // f
        [ 8 ],       // g
        []           // end
    ],
    mixedGraph = [
        [ 1, 8 ],    // start
        [ 2, 3 ],    // a
        3,       // b
        [ 4, 5 ],    // c
        6,       // d
        6,       // e
        [ 7, 2 ],    // f
        [ 8 ],       // g
        void 0           // end
    ],
    preds = [
        [],
        [ 0 ],
        [ 1, 6 ],
        [ 1, 2 ],
        [ 3 ],
        [ 3 ],
        [ 4, 5 ],
        [ 6 ],
        [ 0, 7 ]
    ],
    correctIdoms = [ null, 0, 1, 1, 3, 3, 3, 6, 0 ],
    correctFrontiers = [ [], [ 8 ], [ 3 ], [ 2, 8 ], [ 6 ], [ 6 ], [ 2, 8 ], [ 8 ], [] ],
    r = 0,
    a = 1,
    b = 2,
    c = 3,
    d = 4,
    e = 5,
    f = 6,
    g = 7,
    h = 8,
    i = 9,
    j = 10,
    k = 11,
    l = 12,
    larger = [
        [ a, b, c ],    // r
        [ d ],          // a
        [ a, d, e ],    // b
        [ f, g ],       // c
        [ l ],          // d,
        [ h ],          // e
        [ i ],          // f
        [ i, j ],       // g
        [ e, k ],       // h
        [ k ],          // i
        [ i ],          // j
        [ r, i ],       // k
        [ h ]           // l
    ],
    rlarger = [
        [ c, b, a ],    // r
        [ d ],          // a
        [ e, a, d ],    // b
        [ f, g ],       // c
        [ l ],          // d,
        [ h ],          // e
        [ i ],          // f
        [ j, i ],       // g
        [ e, k ],       // h
        [ k ],          // i
        [ i ],          // j
        [ i, r ],       // k
        [ h ]           // l
    ],
    largeIdoms = [
        // r a b c d e
        null, r, r, r, r, r,
        c, c, r, r, g, r, d
    ],
    nums = '1  2  3  4  5  6  7  8  9  10 11 12 13',
    ltrs = 'r  a  b  c  d  e  f  g  h  i  j  k  l',
    nice = c => c === void 0 || c === null ? 'u' : c === 0 ? 'r' : String.fromCharCode( 0x60 + c ),
    niceNum = n => n + 1 > 9 ? ' ' + ( n + 1 ) : '  ' + ( n + 1 );

console.log( rg );

describe( 'dominators', function() {

    describe( 'CHK fast iterative dominator finder', function() {

        it( 'should find all immediate dominators', () => {
            expect( iter( testGraph ) ).to.eql( correctIdoms );
        } );

        it( 'should find all immediate dominators in larger graph', () => {
            expect( iter( larger ) ).to.eql( largeIdoms );
        } );

    } );

    describe( 'Lengauer-Tarjan dominator finder', function() {

        // it( 'should find all immediate dominators', () => {
        //     expect( yalt( testGraph ) ).to.eql( correctIdoms );
        // } );
        //
        // it( 'should find all immediate dominators in flat mode', () => {
        //     expect( yalt( testGraph, 0, 'flat' ) ).to.eql( correctIdoms );
        // } );

        it( 'should find all immediate dominators in large mode', () => {
            const preInOrder = [];

            DFS( rlarger, { pre: ( index, pre ) => preInOrder[ index ] = pre } );
            console.log( '     ' + preInOrder.map( niceNum ).join( '' ) );
            console.log( '       ' + nums );
            console.log( '       ' + ltrs );
            console.log( 'yalt:', yalt( rlarger, 0, 'snik' ).map( c => ' ' + nice( c ) ).join( ' ' ) );
            console.log( 'okay:', largeIdoms.map( c => ' ' + nice( c ) ).join( ' ' ) );
            // expect( yalt( larger, 0, 'normal' ) ).to.eql( largeIdoms );
        } );

        // it( 'should default to finding all immediate dominators in normal mode', () => {
        //     expect( yalt( testGraph, 0, 'snargle' ) ).to.eql( correctIdoms );
        // } );

    } );

    // describe( 'Dominanace frontiers', function() {
    //
    //     it( 'should check for trivial cases and throw errors when required', () => {
    //         expect( frontiers_from_succs.bind( null, testGraph, [ 1, 2, 3, 4 ] ) ).to.throw( Error );
    //         expect( frontiers_from_preds( [ 1 ], [ null ] ) ).to.eql( [ [] ] );
    //         expect( frontiers_from_preds( [], [] ) ).to.eql( [] );
    //     } );
    //
    //     it( 'should determine the dominance frontiers from successors', () => {
    //         expect( frontiers_from_succs.bind( null, testGraph ) ).to.throw( TypeError );
    //         expect( frontiers_from_succs( mixedGraph, correctIdoms ) ).to.eql( correctFrontiers );
    //     } );
    //
    //     it( 'should create predecessors from successors', () => {
    //         expect( reverse_flow.bind( null, 'hello' ) ).to.throw( TypeError );
    //         expect( reverse_flow( testGraph ) ).to.eql( preds );
    //     } );
    //
    //     it( 'should determine the dominance frontiers from predecessors', () => {
    //         expect( frontiers_from_preds.bind( null, testGraph ) ).to.throw( TypeError );
    //         expect( frontiers_from_preds( preds, correctIdoms ) ).to.eql( correctFrontiers );
    //     } );
    //
    // } );
} );
