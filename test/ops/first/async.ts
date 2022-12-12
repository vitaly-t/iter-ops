import {_asyncValues, expect} from '../../header';
import {pipe, first} from '../../../src/entry/async';

export default () => {
    describe('without predicate', () => {
        it('must emit last value', async () => {
            const i = pipe([10, 20, 30], first());
            expect(await _asyncValues(i)).to.eql([10]);
        });
        it('must emit nothing for empty iterables', async () => {
            const i = pipe([], first());
            expect(await _asyncValues(i)).to.eql([]);
        });
    });
    describe('with the predicate', () => {
        it('must call predicate correctly', async () => {
            const input = [1, 2, 3, 4, 5];
            const indexes: number[] = [];
            const i = pipe(
                input,
                first((value, index) => {
                    indexes.push(index);
                    return value % 2 === 0;
                })
            );
            expect(await _asyncValues(i)).to.eql([2]);
            expect(indexes).to.eql([0, 1]);
        });
        it('must call async predicate correctly', async () => {
            const input = [1, 2, 3, 4, 5];
            const indexes: number[] = [];
            const i = pipe(
                input,
                first(async (value, index) => {
                    indexes.push(index);
                    return value % 2 === 0;
                })
            );
            expect(await _asyncValues(i)).to.eql([2]);
            expect(indexes).to.eql([0, 1]);
        });
        it('must reject invalid predicate types', async () => {
            const i = pipe([10, 20, 30], first('bla' as any));
            expect(await _asyncValues(i)).to.eql([10]);
        });
    });
};
