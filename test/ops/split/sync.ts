import {expect} from '../../header';
import {pipe, split} from '../../../src/entry/sync';
import {ISplitIndex, SplitValueCarry} from '../../../src';

export default () => {
    describe('without options', () => {
        it('must do regular split', () => {
            const i = pipe(
                'one two three',
                split((a) => a === ' ')
            );
            expect([...i]).to.eql([
                ['o', 'n', 'e'],
                ['t', 'w', 'o'],
                ['t', 'h', 'r', 'e', 'e'],
            ]);
        });
        it('must process gaps correctly', () => {
            const i = pipe(
                [0, 1, 2, 0, 3, 4, 0, 0],
                split((a) => a === 0)
            );
            expect([...i]).to.eql([[], [1, 2], [3, 4], [], []]);
        });
    });
    describe('with option', () => {
        describe('carry', () => {
            it('must be able to carry back', () => {
                const i = pipe(
                    [0, 1, 2, 0, 0, 3, 4, 0, 0],
                    split((a) => a === 0, {carryStart: -1, carryEnd: -1})
                );
                expect([...i]).to.eql([
                    [0],
                    [1, 2, 0],
                    [0],
                    [3, 4, 0],
                    [0],
                    [],
                ]);
            });
            it('must be able to carry forward', () => {
                const i = pipe(
                    [0, 1, 2, 0, 0, 3, 4, 0, 0],
                    split((a) => a === 0, {carryStart: 1, carryEnd: 1})
                );
                expect([...i]).to.eql([
                    [],
                    [0, 1, 2],
                    [0],
                    [0, 3, 4],
                    [0],
                    [0],
                ]);
            });
        });
        describe('toggle', () => {
            describe('without carrying', () => {
                it('must handle any regular scenario', () => {
                    const i1 = pipe(
                        [0, 1, 2, 0, 0, 3, 4],
                        split((a) => !a, {
                            toggle: true,
                            carryStart: 'bla' as any, // for coverage
                            carryEnd: 'bla' as any, // for coverage
                        })
                    );
                    expect([...i1]).to.eql([
                        [1, 2],
                        [3, 4],
                    ]);

                    const i2 = pipe(
                        [1, 2, 0, 0, 3, 4, 0],
                        split((a) => !a, {
                            toggle: true,
                            carryStart: SplitValueCarry.none, // just for coverage
                        })
                    );
                    expect([...i2]).to.eql([[], []]);

                    const i3 = pipe(
                        [1, 2, 0, 3, 4, 0],
                        split((a) => !a, {toggle: true})
                    );
                    expect([...i3]).to.eql([[3, 4]]);
                });
                it('must handle no toggles', () => {
                    const i = pipe(
                        [1, 2, 3, 4, 5],
                        split(() => false, {toggle: true})
                    );
                    expect([...i]).to.eql([]);
                });
                it('must handle all toggles', () => {
                    // ending with open toggle:
                    const i1 = pipe(
                        [1, 2, 3, 4, 5],
                        split(() => true, {toggle: true})
                    );
                    expect([...i1]).to.eql([[], [], []]);

                    // ending with closed toggle:
                    const i2 = pipe(
                        [1, 2, 3, 4, 5, 6],
                        split(() => true, {toggle: true})
                    );
                    expect([...i2]).to.eql([[], [], []]);
                });
            });
            describe('with carrying', () => {
                it('must work with carrying back', () => {
                    const i1 = pipe(
                        [1, 2, 3, 4, 5],
                        split(() => true, {toggle: true, carryStart: -1})
                    );
                    expect([...i1]).to.eql([[1], [3], [5]]);

                    const i2 = pipe(
                        [1, 2, 3, 4, 5],
                        split(() => true, {
                            toggle: true,
                            carryStart: -1,
                            carryEnd: -1,
                        })
                    );
                    expect([...i2]).to.eql([[1, 2], [3, 4], [5]]);
                });
                it('must work with carrying forward', () => {
                    const i1 = pipe(
                        [1, 2, 3, 4, 5],
                        split((a) => !!a, {toggle: true, carryStart: 1})
                    );
                    expect([...i1]).to.eql([[1], [3], [5]]);

                    const i2 = pipe(
                        [0, 1, 2, 0, 3, 4, 0, 5],
                        split((a) => a === 0, {
                            toggle: true,
                            carryStart: 1,
                            carryEnd: 1,
                        })
                    );
                    expect([...i2]).to.eql([
                        [0, 1, 2],
                        [0, 0, 5],
                    ]);
                });
                it('must handle triggers without values', () => {
                    const i1 = pipe(
                        [0, 0, 0, 0],
                        split((a) => a === 0, {
                            toggle: true,
                            carryStart: 1,
                            carryEnd: 1,
                        })
                    );
                    expect([...i1]).to.eql([[0], [0, 0]]);

                    const i2 = pipe(
                        [0, 0, 0, 0],
                        split((a) => a === 0, {
                            toggle: true,
                            carryStart: -1,
                            carryEnd: -1,
                        })
                    );
                    expect([...i2]).to.eql([
                        [0, 0],
                        [0, 0],
                    ]);
                });
            });
        });
    });
    describe('indexes', () => {
        describe('for split, no carrying', () => {
            it('must report correct indexes', () => {
                const indexes: ISplitIndex[] = [];
                const i = pipe(
                    'one two',
                    split((a, idx) => {
                        indexes.push(idx);
                        return a === ' ';
                    })
                );
                [...i];
                expect(indexes).to.eql([
                    {start: 0, list: 0, split: 0},
                    {start: 1, list: 1, split: 0},
                    {start: 2, list: 2, split: 0},
                    {start: 3, list: 3, split: 0},
                    {start: 4, list: 0, split: 1},
                    {start: 5, list: 1, split: 1},
                    {start: 6, list: 2, split: 1},
                ]);
            });
        });
        describe('for split, carrying forward', () => {
            it('must report correct indexes', () => {
                const indexes: ISplitIndex[] = [];
                const i = pipe(
                    'one two',
                    split(
                        (a, idx) => {
                            indexes.push(idx);
                            return a === ' ';
                        },
                        {carryEnd: 1}
                    )
                );
                [...i];
                expect(indexes).to.eql([
                    {start: 0, list: 0, split: 0},
                    {start: 1, list: 1, split: 0},
                    {start: 2, list: 2, split: 0},
                    {start: 3, list: 3, split: 0},
                    {start: 4, list: 1, split: 1},
                    {start: 5, list: 2, split: 1},
                    {start: 6, list: 3, split: 1},
                ]);
            });
        });
        describe('for toggle', () => {
            it('must report correct indexes, without carrying', () => {
                const indexes: ISplitIndex[] = [];
                const input = [-1, 1, 2, 3, -2, 4, 5, -3, 6, 7];
                const i = pipe(
                    input,
                    split(
                        (a, idx) => {
                            indexes.push(idx);
                            return a < 0;
                        },
                        {toggle: true}
                    )
                );
                [...i];
                expect(indexes).to.eql([
                    {start: 0, list: 0, split: 0},
                    {start: 1, list: 0, split: 1},
                    {start: 2, list: 1, split: 1},
                    {start: 3, list: 2, split: 1},
                    {start: 4, list: 3, split: 1},
                    {start: 5, list: 0, split: 1},
                    {start: 6, list: 0, split: 1},
                    {start: 7, list: 0, split: 1},
                    {start: 8, list: 0, split: 2},
                    {start: 9, list: 1, split: 2},
                ]);
            });
            it('must report correct indexes for carry=back', () => {
                const indexes: ISplitIndex[] = [];
                const i = pipe(
                    [1, 2, 3, 4, 5],
                    split(
                        (a, idx) => {
                            indexes.push(idx);
                            return true;
                        },
                        {toggle: true, carryStart: -1, carryEnd: -1}
                    )
                );
                [...i];
                expect(indexes).to.eql([
                    {start: 0, list: 0, split: 0},
                    {start: 1, list: 0, split: 1},
                    {start: 2, list: 0, split: 1},
                    {start: 3, list: 0, split: 2},
                    {start: 4, list: 0, split: 2},
                ]);
            });
            it('must report correct indexes for carry=forward', () => {
                const indexes: ISplitIndex[] = [];
                const i = pipe(
                    [1, 2, 3, 4, 5],
                    split(
                        (a, idx) => {
                            indexes.push(idx);
                            return true;
                        },
                        {toggle: true, carryStart: 1, carryEnd: 1}
                    )
                );
                [...i];
                expect(indexes).to.eql([
                    {start: 0, list: 0, split: 0},
                    {start: 1, list: 1, split: 1},
                    {start: 2, list: 0, split: 1},
                    {start: 3, list: 1, split: 2},
                    {start: 4, list: 0, split: 2},
                ]);
            });
        });
    });
};
