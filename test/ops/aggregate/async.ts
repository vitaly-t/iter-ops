import {_asyncValues, expect} from '../../header';
import {pipeAsync, aggregate} from '../../../src';

export default () => {
    it('must process data correctly', async () => {
        const output = pipeAsync(
            [1, 2, 3],
            aggregate((arr) => {
                return arr.reduce((a, c) => a + c);
            })
        );
        expect(await _asyncValues(output)).to.eql([6]);
    });
    it('must handle empty iterables', async () => {
        const output = pipeAsync(
            [],
            aggregate((arr) => {
                return arr;
            })
        );
        expect(await _asyncValues(output)).to.eql([[]]);
    });
    it('must allow return of nothing', async () => {
        const output = pipeAsync(
            [],
            aggregate(() => {})
        );
        expect(await _asyncValues(output)).to.eql([undefined]);
    });
};
