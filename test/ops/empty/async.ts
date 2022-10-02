import {_async, _asyncValues, expect} from '../../header';
import {pipeAsync, empty} from '../../../src';

export default () => {
    it('must produce empty iterable', async () => {
        const input = _async([1, 2, 3]);
        const output = pipeAsync(input, empty());
        expect(await _asyncValues(output)).to.eql([]);
    });
};
