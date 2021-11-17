import {expect} from './header';
import {pipe, last} from '../src';

describe('last', () => {
    describe('without predicate', () => {
        it('must emit last value', () => {
            const input = [1, 2, 3];
            const output = pipe(input, last());
            expect([...output]).to.eql([3]);
        });
        it('must emit nothing for empty iterables', () => {
            const output = pipe([], last());
            expect([...output]).to.eql([]);
        });
    });
    describe('with the predicate', () => {
        it('must call the predicate correctly', () => {
            const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            const indexes: number[] = [];
            const output = pipe(input, last((value, index) => {
                indexes.push(index);
                return value % 2 === 0;
            }));
            expect([...output]).to.eql([8]);
            expect(indexes).to.eql([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        });
        it('must reject invalid predicate types', () => {
            const input = [1, 2, 3];
            const output = pipe(input, last('bla' as any));
            expect([...output]).to.eql([3]);
        });
    });
});
