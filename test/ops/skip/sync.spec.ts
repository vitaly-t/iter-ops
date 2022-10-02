import {expect} from '../../header';
import {pipe, skip} from '../../../src';

describe('sync skip', () => {
    const input = [1, 2, 3, 4, 5];
    it('must emit after count', () => {
        const output = pipe(input, skip(3));
        expect([...output]).to.eql([4, 5]);
    });
    it('must support non-starters', () => {
        const output = pipe(input, skip(input.length));
        expect([...output]).to.eql([]);
    });
    it('must allow skipping zero items', () => {
        const output = pipe(input, skip(0));
        expect([...output]).to.eql(input);
    });
    it('must ignore negative counts', () => {
        const output = pipe(input, skip(-2));
        expect([...output]).to.eql(input);
    });
});
