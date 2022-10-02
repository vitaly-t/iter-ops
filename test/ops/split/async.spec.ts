import {_async, _asyncValues, expect} from '../../header';
import {pipe, split, SplitValueCarry, ISplitIndex} from '../../../src';

describe('async split', () => {
    describe('without options', () => {
        it('must do regular split', async () => {
            const i = pipe(
                _async('one two three'),
                split((a) => a === ' ')
            );
            expect(await _asyncValues(i)).to.eql([
                ['o', 'n', 'e'],
                ['t', 'w', 'o'],
                ['t', 'h', 'r', 'e', 'e'],
            ]);
        });
        it('must do regular async split', async () => {
            const i = pipe(
                _async('one two three'),
                split(async (a) => a === ' ')
            );
            expect(await _asyncValues(i)).to.eql([
                ['o', 'n', 'e'],
                ['t', 'w', 'o'],
                ['t', 'h', 'r', 'e', 'e'],
            ]);
        });
        it('must process gaps correctly', async () => {
            const i = pipe(
                _async([0, 1, 2, 0, 3, 4, 0, 0]),
                split((a) => a === 0)
            );
            expect(await _asyncValues(i)).to.eql([[], [1, 2], [3, 4], [], []]);
        });
    });
    describe('with option', () => {
        describe('carry', () => {
            it('must be able to carry back', async () => {
                const i = pipe(
                    _async([0, 1, 2, 0, 0, 3, 4, 0, 0]),
                    split((a) => a === 0, {
                        carryStart: -1,
                        carryEnd: -1,
                    })
                );
                expect(await _asyncValues(i)).to.eql([
                    [0],
                    [1, 2, 0],
                    [0],
                    [3, 4, 0],
                    [0],
                    [],
                ]);
            });
            it('must be able to carry forward', async () => {
                const i = pipe(
                    _async([0, 1, 2, 0, 0, 3, 4, 0, 0]),
                    split((a) => a === 0, {carryStart: 1, carryEnd: 1})
                );
                expect(await _asyncValues(i)).to.eql([
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
                it('must handle any regular scenario', async () => {
                    const i1 = pipe(
                        _async([0, 1, 2, 0, 0, 3, 4]),
                        split((a) => !a, {
                            toggle: true,
                            carryStart: 'bla' as any, // for coverage
                            carryEnd: 'bla' as any, // for coverage
                        })
                    );
                    expect(await _asyncValues(i1)).to.eql([
                        [1, 2],
                        [3, 4],
                    ]);

                    const i2 = pipe(
                        _async([1, 2, 0, 0, 3, 4, 0]),
                        split((a) => !a, {
                            toggle: true,
                            carryStart: SplitValueCarry.none, // just for coverage
                        })
                    );
                    expect(await _asyncValues(i2)).to.eql([[], []]);

                    const i3 = pipe(
                        _async([1, 2, 0, 3, 4, 0]),
                        split((a) => !a, {toggle: true})
                    );
                    expect(await _asyncValues(i3)).to.eql([[3, 4]]);
                });
                it('must handle no toggles', async () => {
                    const i = pipe(
                        _async([1, 2, 3, 4, 5]),
                        split(() => false, {toggle: true})
                    );
                    expect(await _asyncValues(i)).to.eql([]);
                });
                it('must handle all toggles', async () => {
                    // ending with open toggle:
                    const i1 = pipe(
                        _async([1, 2, 3, 4, 5]),
                        split(() => true, {toggle: true})
                    );
                    expect(await _asyncValues(i1)).to.eql([[], [], []]);

                    // ending with closed toggle:
                    const i2 = pipe(
                        _async([1, 2, 3, 4, 5, 6]),
                        split(() => true, {toggle: true})
                    );
                    expect(await _asyncValues(i2)).to.eql([[], [], []]);
                });
            });
            describe('with carrying', () => {
                it('must work with carrying back', async () => {
                    const i1 = pipe(
                        _async([1, 2, 3, 4, 5]),
                        split(() => true, {toggle: true, carryStart: -1})
                    );
                    expect(await _asyncValues(i1)).to.eql([[1], [3], [5]]);

                    const i2 = pipe(
                        _async([1, 2, 3, 4, 5]),
                        split(() => true, {
                            toggle: true,
                            carryStart: -1,
                            carryEnd: -1,
                        })
                    );
                    expect(await _asyncValues(i2)).to.eql([
                        [1, 2],
                        [3, 4],
                        [5],
                    ]);
                });
                it('must work with carrying forward', async () => {
                    const i1 = pipe(
                        _async([1, 2, 3, 4, 5]),
                        split((a) => !!a, {toggle: true, carryStart: 1})
                    );
                    expect(await _asyncValues(i1)).to.eql([[1], [3], [5]]);

                    const i2 = pipe(
                        _async([0, 1, 2, 0, 3, 4, 0, 5]),
                        split((a) => a === 0, {
                            toggle: true,
                            carryStart: 1,
                            carryEnd: 1,
                        })
                    );
                    expect(await _asyncValues(i2)).to.eql([
                        [0, 1, 2],
                        [0, 0, 5],
                    ]);
                });
                it('must handle triggers without values', async () => {
                    const i1 = pipe(
                        _async([0, 0, 0, 0]),
                        split((a) => a === 0, {
                            toggle: true,
                            carryStart: 1,
                            carryEnd: 1,
                        })
                    );
                    expect(await _asyncValues(i1)).to.eql([[0], [0, 0]]);

                    const i2 = pipe(
                        _async([0, 0, 0, 0]),
                        split((a) => a === 0, {
                            toggle: true,
                            carryStart: -1,
                            carryEnd: -1,
                        })
                    );
                    expect(await _asyncValues(i2)).to.eql([
                        [0, 0],
                        [0, 0],
                    ]);
                });
            });
        });
    });
    describe('indexes', () => {
        describe('for split, no carrying', () => {
            it('must report correct indexes', async () => {
                const indexes: ISplitIndex[] = [];
                const i = pipe(
                    _async('one two'),
                    split((a, idx) => {
                        indexes.push(idx);
                        return a === ' ';
                    })
                );
                await _asyncValues(i);
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
            it('must report correct indexes', async () => {
                const indexes: ISplitIndex[] = [];
                const i = pipe(
                    _async('one two'),
                    split(
                        (a, idx) => {
                            indexes.push(idx);
                            return a === ' ';
                        },
                        {carryEnd: 1}
                    )
                );
                await _asyncValues(i);
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
            it('must report correct indexes, without carrying', async () => {
                const indexes: ISplitIndex[] = [];
                const input = _async([-1, 1, 2, 3, -2, 4, 5, -3, 6, 7]);
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
                await _asyncValues(i);
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
            it('must report correct indexes for carry=back', async () => {
                const indexes: ISplitIndex[] = [];
                const i = pipe(
                    _async([1, 2, 3, 4, 5]),
                    split(
                        (a, idx) => {
                            indexes.push(idx);
                            return true;
                        },
                        {toggle: true, carryStart: -1, carryEnd: -1}
                    )
                );
                await _asyncValues(i);
                expect(indexes).to.eql([
                    {start: 0, list: 0, split: 0},
                    {start: 1, list: 0, split: 1},
                    {start: 2, list: 0, split: 1},
                    {start: 3, list: 0, split: 2},
                    {start: 4, list: 0, split: 2},
                ]);
            });
            it('must report correct indexes for carry=forward', async () => {
                const indexes: ISplitIndex[] = [];
                const i = pipe(
                    _async([1, 2, 3, 4, 5]),
                    split(
                        (a, idx) => {
                            indexes.push(idx);
                            return true;
                        },
                        {toggle: true, carryStart: 1, carryEnd: 1}
                    )
                );
                await _asyncValues(i);
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
});
