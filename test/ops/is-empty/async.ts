import {_async, _asyncValues, expect} from '../../header';
import {pipeAsync, isEmpty} from '../../../src';

export default () => {
    it('must detect empty iterables', async () => {
        const output = pipeAsync(_async([]), isEmpty());
        expect(await _asyncValues(output)).to.eql([true]);
    });
    it('must detect non-empty iterables', async () => {
        const output = pipeAsync(_async([1]), isEmpty());
        expect(await _asyncValues(output)).to.eql([false]);
    });
};
