import {expect} from './header';
import {pipe, toArray} from '../src';

describe('toArray', () => {
    it('must recreate input array', () => {
        const input = [1, 2, 3];
        const output = pipe(input, toArray());
        expect(output.first).to.eql(input);
    });
    it('must not generate more than one value', () => {
        const input = [1, 2];
        const output = pipe(input, toArray());
        const i = output[Symbol.iterator]();
        const result = i.next() && i.next();
        expect(result).to.eql({value: undefined, done: true});
    });
});
