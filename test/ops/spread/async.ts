import {_asyncValues, expect} from '../../header';
import {pipeAsync, spread} from '../../../src';

export default () => {
    it('must split strings', async () => {
        const output = pipeAsync(['one', 'two'], spread());
        expect(await _asyncValues(output)).to.eql([
            'o',
            'n',
            'e',
            't',
            'w',
            'o',
        ]);
    });
    it('must split arrays', async () => {
        const second = [3, 4];
        const output = pipeAsync([[1, 2], second], spread());
        expect(await _asyncValues(output)).to.eql([1, 2, 3, 4]);
    });
    it('must handle empty iterables', async () => {
        const output1 = pipeAsync([], spread());
        const output2 = pipeAsync([[]], spread());
        const output3 = pipeAsync([[], []], spread());
        const output4 = pipeAsync([''], spread());
        expect(await _asyncValues(output1)).to.eql([]);
        expect(await _asyncValues(output2)).to.eql([]);
        expect(await _asyncValues(output3)).to.eql([]);
        expect(await _asyncValues(output4)).to.eql([]);
    });
    it('must find values after empty', async () => {
        const output = pipeAsync([[], [1]], spread());
        expect(await _asyncValues(output)).to.eql([1]);
    });
    it('must throw on non-iterable', async () => {
        let err: any;
        try {
            await _asyncValues(pipeAsync(['text', 123 as any], spread()));
        } catch (e) {
            err = e;
        }
        expect(err?.message).to.eql('Value at index 1 is not iterable: 123');
    });
};
