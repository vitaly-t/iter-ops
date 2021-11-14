import {expect} from './header';
import {pipe} from '../src';

describe('pipe', () => {
    it('must work without operators', () => {
        const input = [10, 20, 30];
        const output = pipe(input);
        expect([...output]).to.eql(input);
        expect(output.first).to.eql(10);
    });
});
