import {_asyncValues, expect} from '../../header';
import {pipeAsync, map, wait} from '../../../src';

export default () => {
    it('must resolve promises', async () => {
        const i = pipeAsync(
            [1, 2, 3],
            map((a) => Promise.resolve(a)),
            wait()
        );
        expect(await _asyncValues(i)).to.eql([1, 2, 3]);
    });
    it('must allow simple values', async () => {
        const i = pipeAsync([1, 2, 3], wait());
        expect(await _asyncValues(i)).to.eql([1, 2, 3]);
    });
};
