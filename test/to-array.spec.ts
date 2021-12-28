import {_async, expect} from './header';
import {pipe, toArray} from '../src';

describe('sync toArray', () => {
    it('must recreate input array', () => {
        const input = [1, 2, 3];
        const output = pipe(input, toArray());
        expect(output.first).to.eql(input);
    });
    it('must not generate more than one value', () => {
        const input = [1, 2];
        const output = pipe(input, toArray());
        const i = output[Symbol.iterator]();
        const result = i.next() && i.next();
        expect(result).to.eql({value: undefined, done: true});
    });
});

describe('async toArray', () => {
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
});
