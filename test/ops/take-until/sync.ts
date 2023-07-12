import {expect} from '../../header';
import {pipe, takeUntil} from '../../../src';

export default () => {
    it('must stop on condition', () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            input,
            takeUntil((a) => a > 2)
        );
        expect([...output]).to.eql([1, 2]);
    });
    it('must provide correct indexes', () => {
        const input = [1, 2, 3, 4, 5];
        const indexes: Array<any> = [];
        const output = pipe(
            input,
            takeUntil((a, idx) => {
                indexes.push(idx);
                return a > 2;
            })
        );
        [...output];
        expect(indexes).to.eql([0, 1, 2]);
    });
    it('must not let overlap the condition', () => {
        const input = [1, 2, 3];
        const output = pipe(
            input,
            takeUntil((a) => a === 2)
        );
        const i = output[Symbol.iterator]();
        expect(i.next()).to.eql({value: 1, done: false});
        expect(i.next()).to.eql({value: undefined, done: true});
        expect(i.next()).to.eql({value: undefined, done: true}); // key test here
    });
    it('must reuse the state object', () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipe(
            input,
            takeUntil((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return index === 2;
            })
        );
        expect([...output]).to.eql(['h', 'e']);
        expect(arr).to.eql([1, 2, 3]);
    });
};
