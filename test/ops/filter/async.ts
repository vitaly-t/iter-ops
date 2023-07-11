import {_async, _asyncValues, expect} from '../../header';
import {pipe, filter} from '../../../src';

export default () => {
    it('must emit on condition', async () => {
        const input = [1, 2, 3, 4, 5, 0];
        const output = pipe(
            _async(input),
            filter((a: number) => a < 3),
        );
        expect(await _asyncValues(output)).to.eql([1, 2, 0]);
    });
    it('must emit async condition', async () => {
        const input = [1, 2, 3, 4, 5, 0];
        const output = pipe(
            _async(input),
            filter(async (a: number) => a < 3),
        );
        expect(await _asyncValues(output)).to.eql([1, 2, 0]);
    });
    it('must reuse the state object', async () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipe(
            _async(input),
            filter((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return false;
            }),
        );
        await _asyncValues(output);
        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
    });
};
