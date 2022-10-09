import {_async, _asyncValues, expect} from '../../header';
import {pipe, take} from '../../../src';

export default () => {
    const input = [10, 20, 30, 40, 50];

    it('must emit the right number of values', async () => {
        const output = pipe(_async(input), take(2));
        expect(await _asyncValues(output)).to.eql([10, 20]);
    });
    it('must emit nothing for zero', async () => {
        const output = pipe(_async(input), take(0));
        expect(await _asyncValues(output)).to.eql([]);
    });
    it('must emit all when count is too big', async () => {
        const output = pipe(_async(input), take(100));
        expect(await _asyncValues(output)).to.eql(input);
    });
    it('must not overlap the limit', async () => {
        const output = pipe(_async(input), take(1));
        const i = output[Symbol.asyncIterator]();
        const res = (await i.next()) && (await i.next()) && (await i.next());
        expect(res).to.eql({value: undefined, done: true});
    });
};
