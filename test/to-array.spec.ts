import {expect} from './header';
import {pipe, toArray} from '../src';

describe('toArray', () => {
    it('must recreate input array', () => {
        const input = [1, 2, 3];
        expect(pipe(input, toArray())).to.eql(input);
    });
});
