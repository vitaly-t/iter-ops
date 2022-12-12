import {_asyncValues, expect, _async} from '../../header';
import {pipe, spread} from '../../../src/entry/async';

export default () => {
    it('must split strings', async () => {
        const output = pipe(['one', 'two'], spread());
        expect(await _asyncValues(output)).to.eql([
            'o',
            'n',
            'e',
            't',
            'w',
            'o',
        ]);
    });
    it('must spread arrays', async () => {
        const second = [3, 4];
        const output = pipe([[1, 2], second], spread());
        expect(await _asyncValues(output)).to.eql([1, 2, 3, 4]);
    });
    it('must spread async arrays', async () => {
        const second = [3, 4];
        const output = pipe([_async([1, 2]), second], spread());
        expect(await _asyncValues(output)).to.eql([1, 2, 3, 4]);
    });
    it('must handle empty iterables', async () => {
        const output1 = pipe([], spread());
        const output2 = pipe([[]], spread());
        const output3 = pipe([[], []], spread());
        const output4 = pipe([''], spread());
        expect(await _asyncValues(output1)).to.eql([]);
        expect(await _asyncValues(output2)).to.eql([]);
        expect(await _asyncValues(output3)).to.eql([]);
        expect(await _asyncValues(output4)).to.eql([]);
    });
    it('must find values after empty', async () => {
        const output = pipe([[], [1]], spread());
        expect(await _asyncValues(output)).to.eql([1]);
    });
    it('must throw on non-iterable', async () => {
        let err: any;
        try {
            await _asyncValues(pipe(['text', 123 as any], spread()));
        } catch (e) {
            err = e;
        }
        expect(err?.message).to.eql('Value at index 1 is not iterable: 123');
    });
};
