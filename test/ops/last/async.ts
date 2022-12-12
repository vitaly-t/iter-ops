import {_asyncValues, expect} from '../../header';
import {pipe, last} from '../../../src/entry/async';

export default () => {
    describe('without predicate', () => {
        it('must emit last value', async () => {
            const i = pipe([1, 2, 3], last());
            expect(await _asyncValues(i)).to.eql([3]);
        });
        it('must emit nothing for empty iterables', async () => {
            const output = pipe([], last());
            expect(await _asyncValues(output)).to.eql([]);
        });
    });
    describe('with the predicate', () => {
        it('must call the predicate correctly', async () => {
            const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const indexes: number[] = [];
            const i = pipe(
                input,
                last((value, index) => {
                    indexes.push(index);
                    return value % 2 === 0;
                })
            );
            expect(await _asyncValues(i)).to.eql([8]);
            expect(indexes).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        });
        it('must call the async predicate correctly', async () => {
            const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const indexes: number[] = [];
            const i = pipe(
                input,
                last(async (value, index) => {
                    indexes.push(index);
                    return value % 2 === 0;
                })
            );
            expect(await _asyncValues(i)).to.eql([8]);
            expect(indexes).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        });
        it('must reject invalid predicate types', async () => {
            const i = pipe([1, 2, 3], last('bla' as any));
            expect(await _asyncValues(i)).to.eql([3]);
        });
    });
};
