import {_asyncValues, expect} from '../../header';
import {pipe, skip} from '../../../src/entry/async';

export default () => {
    const input = [1, 2, 3, 4, 5];
    it('must emit after count', async () => {
        const output = pipe(input, skip(3));
        expect(await _asyncValues(output)).to.eql([4, 5]);
    });
    it('must support non-starters', async () => {
        const output = pipe(input, skip(input.length));
        expect(await _asyncValues(output)).to.eql([]);
    });
    it('must allow skipping zero items', async () => {
        const output = pipe(input, skip(0));
        expect(await _asyncValues(output)).to.eql(input);
    });
    it('must ignore negative counts', async () => {
        const output = pipe(input, skip(-2));
        expect(await _asyncValues(output)).to.eql(input);
    });
};
