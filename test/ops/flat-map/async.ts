import {_async, _asyncValues, expect} from '../../header';
import {flatMap, pipeAsync} from '../../../src';

export default () => {
    it('must flatten all iterables', async () => {
        const output = pipeAsync(
            _async([1, 2, 'one', _async('two'), 'three']),
            flatMap((a) => a)
        );
        expect(await _asyncValues(output)).to.eql([
            1,
            2,
            'o',
            'n',
            'e',
            't',
            'w',
            'o',
            't',
            'h',
            'r',
            'e',
            'e',
        ]);
    });
    it('must spread sync-mapped values', async () => {
        const output = pipeAsync(
            ['one', 1, 2, [3]],
            flatMap((a) => [a])
        );
        expect(await _asyncValues(output)).to.eql(['one', 1, 2, [3]]);
    });
    it('must spread async-mapped values', async () => {
        const output = pipeAsync(
            ['one', 1, 2, [3]],
            flatMap(async (a) => [a])
        );
        expect(await _asyncValues(output)).to.eql(['one', 1, 2, [3]]);
    });
};
