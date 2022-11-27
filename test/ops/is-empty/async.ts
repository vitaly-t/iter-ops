import {_asyncValues, expect} from '../../header';
import {pipe, isEmpty} from '../../../src/entry/async';

export default () => {
    it('must detect empty iterables', async () => {
        const output = pipe([], isEmpty());
        expect(await _asyncValues(output)).to.eql([true]);
    });
    it('must detect non-empty iterables', async () => {
        const output = pipe([1], isEmpty());
        expect(await _asyncValues(output)).to.eql([false]);
    });
};
