import {_async, _asyncValues, expect} from '../../header';
import {pipe, takeUntil} from '../../../src';

export default () => {
    it('must stop on condition', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            _async(input),
            takeUntil((a) => a > 2)
        );
        expect(await _asyncValues(output)).to.eql([1, 2]);
    });
    it('must stop on async condition', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            _async(input),
            takeUntil(async (a) => a > 2)
        );
        expect(await _asyncValues(output)).to.eql([1, 2]);
    });
    it('must provide correct indexes', async () => {
        const input = [1, 2, 3, 4, 5];
        const indexes: Array<any> = [];
        const output = pipe(
            _async(input),
            takeUntil((a, idx) => {
                indexes.push(idx);
                return a > 2;
            })
        );
        await _asyncValues(output);
        expect(indexes).to.eql([0, 1, 2]);
    });
    it('must not let overlap the condition', async () => {
        const input = [1, 2, 3];
        const output = pipe(
            _async(input),
            takeUntil((a) => a === 2)
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
            takeUntil(async (a) => a === 2)
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
                return index === 2;
            })
        );
        expect(await _asyncValues(output)).to.eql(['h', 'e']);
        expect(arr).to.eql([1, 2, 3]);
    });
};
