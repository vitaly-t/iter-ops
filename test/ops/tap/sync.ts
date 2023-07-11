import {expect} from '../../header';
import {pipe, tap} from '../../../src';

export default () => {
    it('must be called for all values', () => {
        const input = [1, 2, 3],
            res: any[] = [];
        const a = pipe(
            input,
            tap((val, idx) => {
                res.push({val, idx});
            }),
        );
        [...a]; // trigger iteration
        expect(res).to.eql([
            {val: 1, idx: 0},
            {val: 2, idx: 1},
            {val: 3, idx: 2},
        ]);
    });
    it('must reuse the state object', () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipe(
            input,
            tap((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
            }),
        );
        [...output];
        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
    });
};
