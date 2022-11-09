import {expect} from '../../header';
import {pipe, take} from '../../../src';

export default () => {
    const input = [10, 20, 30, 40, 50];

    it('must emit the right number of values', () => {
        const output = pipe(input, take(2));
        expect([...output]).to.eql([10, 20]);
    });
    it('must emit nothing for zero', () => {
        const output = pipe(input, take(0));
        expect([...output]).to.eql([]);
    });
    it('must emit all when count is too big', () => {
        const output = pipe(input, take(100));
        expect([...output]).to.eql(input);
    });
    it('must not overlap the limit', () => {
        const output = pipe(input, take(1));
        const i = output[Symbol.iterator]();
        const res = i.next() && i.next() && i.next();
        expect(res).to.eql({value: undefined, done: true});
    });
};
