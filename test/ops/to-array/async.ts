import {_async, expect} from '../../header';
import {pipe, toArray} from '../../../src';

export default () => {
    it('must recreate input array', async () => {
        const input = [1, 2, 3];
        const output = pipe(_async(input), toArray());
        expect(await output.first).to.eql(input);
    });
    it('must not generate more than one value', async () => {
        const input = _async([1, 2]);
        const output = pipe(input, toArray());
        const i = output[Symbol.asyncIterator]();
        const result = (await i.next()) && (await i.next());
        expect(result).to.eql({value: undefined, done: true});
    });
};
