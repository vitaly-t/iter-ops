import {expect} from './header';
import {pipe, toArray} from '../src';

describe('toArray', () => {
    it('must recreate input array', () => {
        const input = [1, 2, 3];
        const output = pipe(input, toArray());
        expect([...output]).to.eql([input]);
    });
});
