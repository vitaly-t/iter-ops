import {expect} from '../../header';
import {pipeSync, skip} from '../../../src';

export default () => {
    const input = [1, 2, 3, 4, 5];
    it('must emit after count', () => {
        const output = pipeSync(input, skip(3));
        expect([...output]).to.eql([4, 5]);
    });
    it('must support non-starters', () => {
        const output = pipeSync(input, skip(input.length));
        expect([...output]).to.eql([]);
    });
    it('must allow skipping zero items', () => {
        const output = pipeSync(input, skip(0));
        expect([...output]).to.eql(input);
    });
    it('must ignore negative counts', () => {
        const output = pipeSync(input, skip(-2));
        expect([...output]).to.eql(input);
    });
};
