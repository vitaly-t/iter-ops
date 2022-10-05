import {expect} from '../../header';
import {pipeSync, map} from '../../../src';

export default () => {
    it('must remap values', () => {
        const input = [1, 2, 3];
        const output = pipeSync(
            input,
            map((value) => ({value}))
        );
        expect([...output]).to.eql([{value: 1}, {value: 2}, {value: 3}]);
    });
    it('must produce correct indexes', () => {
        const input = [1, 2, 3];
        const output = pipeSync(
            input,
            map((value, idx) => ({idx}))
        );
        expect([...output]).to.eql([{idx: 0}, {idx: 1}, {idx: 2}]);
    });
    it('must reuse the state object', () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipeSync(
            input,
            map((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
            })
        );
        [...output];
        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
    });
};
