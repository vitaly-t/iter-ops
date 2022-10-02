import {expect} from '../../header';
import {pipe, defaultEmpty} from '../../../src';

describe('sync defaultEmpty', () => {
    it('must not add to a non-empty source', () => {
        const output = pipe([1], defaultEmpty(2));
        expect([...output]).to.eql([1]);
    });
    describe('for an empty source', () => {
        it('must add values', () => {
            const output = pipe([], defaultEmpty(123));
            expect([...output]).to.eql([123]);
        });
        it('must add iterators', () => {
            let value = 4;
            const input: Iterator<number> = {
                next() {
                    if (value--) {
                        return {value};
                    }
                    return {value: undefined, done: true};
                },
            };
            const output = pipe([], defaultEmpty(input));
            expect([...output]).to.eql([3, 2, 1, 0]);
        });
        it('must treat "next" property as value', () => {
            const output = pipe([], defaultEmpty({next: 123}));
            expect([...output]).to.eql([{next: 123}]);
        });
        it('must add iterables', () => {
            const output = pipe([], defaultEmpty([1, 2]));
            expect([...output]).to.eql([1, 2]);
        });
    });
    describe('type inference', () => {
        it('must work for values', () => {
            // the actual test here is compile-time, inferring the type correctly:
            const i: Iterable<number | string> = pipe(
                [1, 2, 3],
                defaultEmpty('hello')
            );
            expect([...i]).to.eql([1, 2, 3]); // default not added
        });
        it('must work for iterators', () => {
            const value = 'hello';
            let done = false;
            const input: Iterator<string> = {
                next() {
                    if (!done) {
                        done = true;
                        return {value};
                    }
                    return {value: undefined, done};
                },
            };
            // the actual test here is compile-time, inferring the type correctly;
            // NOTE: This case does require casting input as Iterator<string> :|
            const i: Iterable<number | string> = pipe(
                [1, 2, 3],
                defaultEmpty(input)
            );
            expect([...i]).to.eql([1, 2, 3]); // default not added
        });
        it('must work for iterables', () => {
            // the actual test here is compile-time, inferring the type correctly:
            const i: Iterable<number | string | boolean> = pipe(
                [1, 2, 3],
                defaultEmpty(['hello', true])
            );
            expect([...i]).to.eql([1, 2, 3]); // default not added
        });
    });
});
