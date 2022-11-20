import {expect} from '../../header';
import {pipe, skipUntil} from '../../../src';

export default () => {
    it('must trigger after condition', () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            input,
            skipUntil((a) => a > 2)
        );
        expect([...output]).to.eql([4, 5]);
    });
    it('must support non-starters', () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            input,
            skipUntil((a) => a > 10)
        );
        expect([...output]).to.eql([]);
    });
    it('must reuse the state object', () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipe(
            input,
            skipUntil((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return true;
            })
        );
        expect([...output]).to.eql(['e', 'l', 'l', 'o', '!']);
        expect(arr).to.eql([1]);
    });
};
