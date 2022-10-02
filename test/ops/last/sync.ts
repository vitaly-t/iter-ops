import {expect} from '../../header';
import {pipeSync, last} from '../../../src';

export default () => {
    describe('without predicate', () => {
        it('must emit last value', () => {
            const i = pipeSync([1, 2, 3], last());
            expect([...i]).to.eql([3]);
        });
        it('must emit nothing for empty iterables', () => {
            const i = pipeSync([], last());
            expect([...i]).to.eql([]);
        });
    });
    describe('with the predicate', () => {
        it('must call the predicate correctly', () => {
            const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const indexes: number[] = [];
            const i = pipeSync(
                input,
                last((value, index) => {
                    indexes.push(index);
                    return value % 2 === 0;
                })
            );
            expect([...i]).to.eql([8]);
            expect(indexes).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        });
        it('must reject invalid predicate types', () => {
            const i = pipeSync([1, 2, 3], last('bla' as any));
            expect([...i]).to.eql([3]);
        });
    });
};
