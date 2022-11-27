import {_async, _asyncValues, expect} from '../../header';
import {pipe, map} from '../../../src';

export default () => {
    it('must remap values', async () => {
        const input = [1, 2, 3];
        const output = pipe(
            _async(input),
            map((value) => ({value}))
        );
        expect(await _asyncValues(output)).to.eql([
            {value: 1},
            {value: 2},
            {value: 3},
        ]);
    });
    it('must produce correct indexes', async () => {
        const input = [1, 2, 3];
        const output = pipe(
            _async(input),
            map((value, idx) => ({idx}))
        );
        expect(await _asyncValues(output)).to.eql([
            {idx: 0},
            {idx: 1},
            {idx: 2},
        ]);
    });
    it('must reuse the state object', async () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipe(
            _async(input),
            map((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
            })
        );
        await _asyncValues(output);
        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
    });
};
