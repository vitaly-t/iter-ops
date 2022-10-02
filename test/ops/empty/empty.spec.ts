import {_async, _asyncValues, expect} from '../../header';
import {pipe, empty} from '../../../src';

describe('sync empty', () => {
    it('must produce empty iterable', () => {
        const input = [1, 2, 3];
        const output = pipe(input, empty());
        expect([...output]).to.eql([]);
    });
});

describe('async empty', () => {
    it('must produce empty iterable', async () => {
        const input = _async([1, 2, 3]);
        const output = pipe(input, empty());
        expect(await _asyncValues(output)).to.eql([]);
    });
});
