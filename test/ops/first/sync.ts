import {expect} from '../../header';
import {pipeSync, first} from '../../../src';

export default () => {
    describe('without predicate', () => {
        it('must emit last value', () => {
            const input = [10, 20, 30];
            const output = pipeSync(input, first());
            expect([...output]).to.eql([10]);
        });
        it('must emit nothing for empty iterables', () => {
            const output = pipeSync([], first());
            expect([...output]).to.eql([]);
        });
    });
    describe('with the predicate', () => {
        it('must call the predicate correctly', () => {
            const input = [1, 2, 3, 4, 5];
            const indexes: number[] = [];
            const output = pipeSync(
                input,
                first((value, index) => {
                    indexes.push(index);
                    return value % 2 === 0;
                })
            );
            expect([...output]).to.eql([2]);
            expect(indexes).to.eql([0, 1]);
        });
        it('must reject invalid predicate types', () => {
            const input = [10, 20, 30];
            const output = pipeSync(input, first('bla' as any));
            expect([...output]).to.eql([10]);
        });
    });
};
