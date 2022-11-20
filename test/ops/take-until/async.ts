import {_async, _asyncValues, expect} from '../../header';
import {pipe, takeUntil} from '../../../src';

export default () => {
    it('must trigger on condition', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            _async(input),
            takeUntil((a) => a <= 3)
        );
        expect(await _asyncValues(output)).to.eql([1, 2, 3]);
    });
    it('must trigger on async condition', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            _async(input),
            takeUntil(async (a) => a <= 3)
        );
        expect(await _asyncValues(output)).to.eql([1, 2, 3]);
    });
    it('must not let overlap the condition', async () => {
        const input = [1, 2, 3];
        const output = pipe(
            _async(input),
            takeUntil((a) => a !== 2)
        );
        const i = output[Symbol.asyncIterator]();
        expect(await i.next()).to.eql({value: 1, done: false});
        expect(await i.next()).to.eql({value: undefined, done: true});
        expect(await i.next()).to.eql({value: undefined, done: true}); // key test here
    });
    it('must not let overlap the async condition', async () => {
        const input = [1, 2, 3];
        const output = pipe(
            _async(input),
            takeUntil(async (a) => a !== 2)
        );
        const i = output[Symbol.asyncIterator]();
        expect(await i.next()).to.eql({value: 1, done: false});
        expect(await i.next()).to.eql({value: undefined, done: true});
        expect(await i.next()).to.eql({value: undefined, done: true}); // key test here
    });
    it('must reuse the state object', async () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipe(
            _async(input),
            takeUntil((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return false;
            })
        );
        expect(await _asyncValues(output)).to.eql([]);
        expect(arr).to.eql([1]);
    });
};
