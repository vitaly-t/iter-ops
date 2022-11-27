import {expect} from '../../header';
import {pipe, skipWhile} from '../../../src/entry/sync';

export default () => {
    it('must start after condition', () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            input,
            skipWhile((a) => a <= 3)
        );
        expect([...output]).to.eql([4, 5]);
    });
    it('must provide correct indexes', () => {
        const input = [1, 2, 3, 4, 5];
        const indexes: Array<any> = [];
        const output = pipe(
            input,
            skipWhile((a, idx) => {
                indexes.push(idx);
                return a <= 3;
            })
        );
        [...output];
        expect(indexes).to.eql([0, 1, 2, 3]);
    });
    it('must support non-starters', () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            input,
            skipWhile((a) => a < 10)
        );
        expect([...output]).to.eql([]);
    });
    it('must reuse the state object', () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipe(
            input,
            skipWhile((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return index < 2;
            })
        );
        expect([...output]).to.eql(['l', 'l', 'o', '!']);
        expect(arr).to.eql([1, 2, 3]);
    });
};
