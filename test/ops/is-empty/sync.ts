import {expect} from '../../header';
import {pipe, isEmpty} from '../../../src/entry/sync';

export default () => {
    it('must detect empty iterables', () => {
        const output = pipe([], isEmpty());
        expect([...output]).to.eql([true]);
    });
    it('must detect non-empty iterables', () => {
        const output = pipe([1], isEmpty());
        expect([...output]).to.eql([false]);
    });
};
