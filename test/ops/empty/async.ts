import {_async, _asyncValues, expect} from '../../header';
import {pipe, empty} from '../../../src';

export default () => {
    it('must produce empty iterable', async () => {
        const input = [1, 2, 3];
        const output = pipe(_async(input), empty());
        expect(await _asyncValues(output)).to.eql([]);
    });
};
