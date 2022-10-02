import {expect} from '../../header';
import {pipe, start} from '../../../src';

describe('sync start', () => {
    it('must trigger on condition', () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            input,
            start((a) => a > 3)
        );
        expect([...output]).to.eql([4, 5]);
    });
    it('must support non-starters', () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            input,
            start((a) => a > 5)
        );
        expect([...output]).to.eql([]);
    });
    it('must reuse the state object', () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipe(
            input,
            start((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return true;
            })
        );
        expect([...output]).to.eql(input.split(''));
        expect(arr).to.eql([1]);
    });
});
