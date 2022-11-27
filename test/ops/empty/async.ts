import {_asyncValues, expect} from '../../header';
import {pipe, empty} from '../../../src/entry/async';

export default () => {
    it('must produce empty iterable', async () => {
        const input = [1, 2, 3];
        const output = pipe(input, empty());
        expect(await _asyncValues(output)).to.eql([]);
    });
};
