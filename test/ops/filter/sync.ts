import {expect} from '../../header';
import {pipe, filter} from '../../../src';

export default () => {
    it('must emit on condition', () => {
        const input = [1, 2, 3, 4, 5, 0];
        const output = pipe(
            input,
            filter((a) => a < 3),
        );
        expect([...output]).to.eql([1, 2, 0]);
    });
    it('must use type guards info to narrow type', () => {
        const input = [1, 2, null, 4, undefined, 0];

        const output: Iterable<number> = pipe(
            input,
            filter(
                (value): value is NonNullable<typeof value> =>
                    value !== null && value !== undefined,
            ),
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
            }),
        );
        [...output];
        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
    });
};
