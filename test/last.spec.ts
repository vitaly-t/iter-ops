import {expect} from './header';
import {pipe, last} from '../src';

describe('last', () => {
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
