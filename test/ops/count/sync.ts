import {_async, expect} from '../../header';
import {pipe, count} from '../../../src';

export default () => {
    it('must count items correctly', () => {
        const input = [10, 20, 30];
        const output = pipe(input, count());
        expect(output.first).to.eql(input.length);
    });
    it('must handle empty iterables', () => {
        const output = pipe([], count());
        expect(output.first).to.eql(0);
    });
    it('must not generate more than one value', () => {
        const input = [10, 20, 30];
        const output = pipe(input, count());
        const i = output[Symbol.iterator]();
        const result = i.next() && i.next();
        expect(result).to.eql({value: undefined, done: true});
    });
    it('must use predicate', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const output1 = pipe(
            input,
            count((a) => a % 2 === 0)
        );
        const output2 = pipe(
            input,
            count((a) => a % 2 > 0)
        );
        expect(output1.first).to.eql(4);
        expect(output2.first).to.eql(5);
    });
};
