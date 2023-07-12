import {_async, _asyncValues, expect} from '../../header';
import {pipe, skipUntil} from '../../../src';

export default () => {
    it('must take on condition', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            _async(input),
            skipUntil((a) => a > 2)
        );
        expect(await _asyncValues(output)).to.eql([3, 4, 5]);
    });
    it('must take on async condition', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            _async(input),
            skipUntil(async (a) => a > 2)
        );
        expect(await _asyncValues(output)).to.eql([3, 4, 5]);
    });
    it('must provide correct indexes', async () => {
        const input = [1, 2, 3, 4, 5];
        const indexes: Array<any> = [];
        const output = pipe(
            _async(input),
            skipUntil((a, idx) => {
                indexes.push(idx);
                return a > 2;
            })
        );
        await _asyncValues(output);
        expect(indexes).to.eql([0, 1, 2]);
    });
    it('must support non-starters', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            _async(input),
            skipUntil((a) => a > 10)
        );
        expect(await _asyncValues(output)).to.eql([]);
    });
    it('must support async non-starters', async () => {
        const input = [1, 2, 3, 4, 5];
        const output = pipe(
            _async(input),
            skipUntil(async (a) => a > 10)
        );
        expect(await _asyncValues(output)).to.eql([]);
    });
    it('must reuse the state object', async () => {
        const input = 'hello!';
        const arr: number[] = [];
        const output = pipe(
            _async(input),
            skipUntil((value, index, state) => {
                state.count = state.count ?? 0;
                state.count++;
                arr.push(state.count);
                return index >= 2;
            })
        );
        expect(await _asyncValues(output)).to.eql(['l', 'l', 'o', '!']);
        expect(arr).to.eql([1, 2, 3]);
    });
};
