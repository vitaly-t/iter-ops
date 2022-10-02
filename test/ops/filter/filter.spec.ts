import {_async, _asyncValues, expect} from '../../header';
import {pipe, filter} from '../../../src';

describe('sync filter', () => {
    it('must emit on condition', () => {
        const input = [1, 2, 3, 4, 5, 0];
        const output = pipe(
            input,
            filter((a) => a < 3)
        );
        expect([...output]).to.eql([1, 2, 0]);
    });
    it('must use type gaurds info to narrow type', () => {
        const input = [1, 2, null, 4, undefined, 0];

        const output: Iterable<number> = pipe(
            input,
            filter(
                (value): value is NonNullable<typeof value> =>
                    value !== null && value !== undefined
            )
        );
        expect([...output]).to.eql([1, 2, 4, 0]);
    });
    it('must reuse the state object', () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipe(
            input,
            filter((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return false;
            })
        );
        [...output];
        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
    });
});

describe('async filter', () => {
    it('must emit on condition', async () => {
        const input = _async([1, 2, 3, 4, 5, 0]);
        const output = pipe(
            input,
            filter((a) => a < 3)
        );
        expect(await _asyncValues(output)).to.eql([1, 2, 0]);
    });
    it('must emit async condition', async () => {
        const input = _async([1, 2, 3, 4, 5, 0]);
        const output = pipe(
            input,
            filter(async (a) => a < 3)
        );
        expect(await _asyncValues(output)).to.eql([1, 2, 0]);
    });
    it('must reuse the state object', async () => {
        const input = _async('hello!');
        const arr: number[] = [];
        const output = pipe(
            input,
            filter((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return false;
            })
        );
        await _asyncValues(output);
        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
    });
});
