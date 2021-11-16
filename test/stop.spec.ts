import {expect} from './header';
import {pipe, stop} from '../src';

describe('stop', () => {
    it('must stop on condition', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const output = pipe(input, stop(a => a > 5));
        expect([...output]).to.eql([1, 2, 3, 4, 5]);
    });
    it('must not let overlap the condition', () => {
        const input = [1, 2, 3];
        const output = pipe(input, stop(a => a === 2));
        const i = output[Symbol.iterator]();
        expect(i.next()).to.eql({value: 1, done: false});
        expect(i.next()).to.eql({value: undefined, done: true});
        expect(i.next()).to.eql({value: undefined, done: true}); // key test here
    });
});
