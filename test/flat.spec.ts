import {_async, _asyncValues, expect} from './header';
import {flat, pipe} from '../src';
import {toIterable} from "../dist";

describe('sync flat', () => {
    // TODO: The first test is already undecided, because Array.prototype.flat() does not split strings, for example.
    //  should our flat() be consistent with that or with the spread operator?
    it('must flatten strings', () => {
        const output = pipe(['one', 'two'], flat());
        expect([...output]).to.eql(['o', 'n', 'e', 't', 'w', 'o']);
    });
    it('must flatten arrays', () => {
        const output = pipe(
            [
                [1, 2],
                [3, 4],
            ],
            flat()
        );
        expect([...output]).to.eql([1, 2, 3, 4]);
    });
    it('must flatten nested arrays', () => {
        const output = pipe(
            [
                [1, 2],
                [3, [4, 5], 6],
            ],
            flat(2)
        );
        expect([...output]).to.eql([1, 2, 3, 4, 5, 6]);
    });

    it('must handle empty iterables', () => {
        const output1 = pipe([], flat());
        const output2 = pipe([[]], flat());
        const output3 = pipe([[], []], flat());
        const output4 = pipe([''], flat());
        expect([...output1]).to.eql([]);
        expect([...output2]).to.eql([]);
        expect([...output3]).to.eql([]);
        expect([...output4]).to.eql([]);
    });
    it('must find values after empty', () => {
        const output = pipe([[], [1]], flat());
        expect([...output]).to.eql([1]);
    });
});

describe('async flat', () => {
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
            'e'
        ]);
    });
    it('must flatten arrays', async () => {
        const second = _async([3, 4]);
        const output = pipe(_async([[1, 2], second]), flat());
        expect(await _asyncValues(output)).to.eql([1, 2, 3, 4]);
    });
    it('must flatten nested arrays', async () => {
        const output = pipe(
            _async([
                [1, 2],
                [3, [4, 5], 6],
            ]),
            flat(2)
        );
        expect(await _asyncValues(output)).to.eql([1, 2, 3, 4, 5, 6]);
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
});
