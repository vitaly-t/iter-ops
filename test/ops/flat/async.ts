import {_async, _asyncValues, expect} from '../../header';
import {flat, pipe} from '../../../src';

export default () => {
    it('must flatten strings', async () => {
        const output = pipe(_async(['one', _async('two'), 'three']), flat());
        expect(await _asyncValues(output)).to.eql([
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
    it('must flatten arrays', async () => {
        const output = pipe(_async([[1, 2], _async([3, 4])]), flat());
        expect(await _asyncValues(output)).to.eql([1, 2, 3, 4]);
    });
    it('must flatten mixed iterables', async () => {
        const output1 = pipe(_async<any>([[1, 2], 3, [4, 5]]), flat());
        expect(await _asyncValues(output1), 'sync inside async').to.eql([
            1, 2, 3, 4, 5,
        ]);
        const input = _async<any>([
            [1, 2],
            [_async([3, 4])],
            [5, 6, [_async([7, 8])]],
        ]);
        const output2 = pipe(input, flat(2));
        const output3 = pipe(input, flat(3));
        expect(await _asyncValues(output2), 'async inside sync').to.eql([
            1,
            2,
            3,
            4,
            5,
            6,
            {},
        ]);
        expect(await _asyncValues(output3), 'async inside sync').to.eql([
            1, 2, 3, 4, 5, 6, 7, 8,
        ]);
    });
    it('must flatten nested arrays to specified depth', async () => {
        const output = pipe(
            _async([
                [1, 2],
                [3, [4, [5, 6], 7]],
            ]),
            flat(2)
        );
        expect(await _asyncValues(output)).to.eql([1, 2, 3, 4, [5, 6], 7]);
    });
    it('must handle empty iterables', async () => {
        const output1 = pipe(_async([]), flat());
        const output2 = pipe(_async([[]]), flat());
        const output3 = pipe(_async([[], []]), flat());
        const output4 = pipe(_async(['']), flat());
        expect(await _asyncValues(output1)).to.eql([]);
        expect(await _asyncValues(output2)).to.eql([]);
        expect(await _asyncValues(output3)).to.eql([]);
        expect(await _asyncValues(output4)).to.eql([]);
    });
    it('must find values after empty', async () => {
        const output = pipe(_async([[], [1]]), flat());
        expect(await _asyncValues(output)).to.eql([1]);
    });
};
