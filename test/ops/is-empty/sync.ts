import {expect} from '../../header';
import {pipeSync, isEmpty} from '../../../src';

export default () => {
    it('must detect empty iterables', () => {
        const output = pipeSync([], isEmpty());
        expect([...output]).to.eql([true]);
    });
    it('must detect non-empty iterables', () => {
        const output = pipeSync([1], isEmpty());
        expect([...output]).to.eql([false]);
    });
};
