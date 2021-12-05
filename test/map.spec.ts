import {expect} from './header';
import {pipe, map} from '../src';

describe('map', () => {
    it('must remap values', () => {
        const input = [1, 2, 3];
        const output = pipe(input, map(value => ({value})));
        expect([...output]).to.eql([{value: 1}, {value: 2}, {value: 3}]);
    });
    it('must reuse the state object', () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipe(input, map((value, index, state) => {
            state.count = state.count ?? 0;
            state.count++;
            arr.push(state.count);
        }));
        [...output];
        expect(arr).to.eql([1, 2, 3, 4, 5, 6]);
    });
});
