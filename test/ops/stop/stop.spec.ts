import {_async, _asyncValues, expect} from '../../header';
import {pipe, stop} from '../../../src';

describe('sync stop', () => {
    it('must trigger on condition', () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            input,
            stop((a) => a > 3)
        );
        expect([...output]).to.eql([1, 2, 3]);
    });
    it('must not let overlap the condition', () => {
        const input = [1, 2, 3];
        const output = pipe(
            input,
            stop((a) => a === 2)
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
            stop((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return true;
            })
        );
        expect([...output]).to.eql([]);
        expect(arr).to.eql([1]);
    });
});

describe('async stop', () => {
    it('must trigger on condition', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            _async(input),
            stop((a) => a > 3)
        );
        expect(await _asyncValues(output)).to.eql([1, 2, 3]);
    });
    it('must trigger on async condition', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            _async(input),
            stop(async (a) => a > 3)
        );
        expect(await _asyncValues(output)).to.eql([1, 2, 3]);
    });
    it('must not let overlap the condition', async () => {
        const input = _async([1, 2, 3]);
        const output = pipe(
            input,
            stop((a) => a === 2)
        );
        const i = output[Symbol.asyncIterator]();
        expect(await i.next()).to.eql({value: 1, done: false});
        expect(await i.next()).to.eql({value: undefined, done: true});
        expect(await i.next()).to.eql({value: undefined, done: true}); // key test here
    });
    it('must not let overlap the async condition', async () => {
        const input = _async([1, 2, 3]);
        const output = pipe(
            input,
            stop(async (a) => a === 2)
        );
        const i = output[Symbol.asyncIterator]();
        expect(await i.next()).to.eql({value: 1, done: false});
        expect(await i.next()).to.eql({value: undefined, done: true});
        expect(await i.next()).to.eql({value: undefined, done: true}); // key test here
    });
    it('must reuse the state object', async () => {
        const input = _async('hello!');
        const arr: number[] = [];
        const output = pipe(
            input,
            stop((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return true;
            })
        );
        expect(await _asyncValues(output)).to.eql([]);
        expect(arr).to.eql([1]);
    });
});
