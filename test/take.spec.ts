import {expect} from './header';
import {pipe, take} from '../src';

describe('take', () => {
    const input = [10, 20, 30, 40, 50];

    it('must yield the right number of elements', () => {
        const output = pipe(input, take(2));
        expect([...output]).to.eql([10, 20]);
    });
    it('must yield nothing for zero', () => {
        const output = pipe(input, take(0));
        expect([...output]).to.eql([]);
    });
    it('must yield all when count is too big', () => {
        const output = pipe(input, take(100));
        expect([...output]).to.eql(input);
    });
});
