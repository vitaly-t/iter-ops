import {_async, expect} from './header';
import {pipe, join} from '../src';

const customObject = {
    toString() {
        return 'custom object';
    },
};

describe('sync join', () => {
    it('must join string correctly', () => {
        const input = ['foo', 'bar', 'baz'];
        const output = pipe(input, join());
        expect(output.first).to.eql('foobarbaz');
    });
    it('must join non-strings correctly', () => {
        const input = [customObject, 1, [2, 3]];
        const output = pipe(input, join());
        expect(output.first).to.eql('custom object12,3');
    });
    it('must join string correctly with separator', () => {
        const input = ['foo', 'bar', 'baz'];
        const output = pipe(input, join(', '));
        expect(output.first).to.eql('foo, bar, baz');
    });
    it('must join non-strings correctly with separator', () => {
        const input = [customObject, 1, [2, 3]];
        const output = pipe(input, join(' + '));
        expect(output.first).to.eql('custom object + 1 + 2,3');
    });
    it('must handle empty iterables', () => {
        const output = pipe([], join());
        expect(output.first).to.eql('');
    });
    it('must not generate more than one value', () => {
        const input = [10, 20, 30];
        const output = pipe(input, join());
        const i = output[Symbol.iterator]();
        const result = i.next() && i.next();
        expect(result).to.eql({value: undefined, done: true});
    });
});

describe('async join', () => {
    it('must join string correctly', async () => {
        const input = ['foo', 'bar', 'baz'];
        const output = pipe(_async(input), join());
        expect(await output.first).to.eql('foobarbaz');
    });
    it('must join non-strings correctly', async () => {
        const input = [customObject, 1, [2, 3]];
        const output = pipe(_async(input), join());
        expect(await output.first).to.eql('custom object12,3');
    });
    it('must join string correctly with separator', async () => {
        const input = ['foo', 'bar', 'baz'];
        const output = pipe(_async(input), join(', '));
        expect(await output.first).to.eql('foo, bar, baz');
    });
    it('must join non-strings correctly with separator', async () => {
        const input = [customObject, 1, [2, 3]];
        const output = pipe(_async(input), join(' + '));
        expect(await output.first).to.eql('custom object + 1 + 2,3');
    });
    it('must handle empty iterables', async () => {
        const output = pipe(_async([]), join());
        expect(await output.first).to.eql('');
    });
    it('must not generate more than one value', async () => {
        const input = [10, 20, 30];
        const output = pipe(_async(input), join());
        const i = output[Symbol.asyncIterator]();
        const result = (await i.next()) && (await i.next());
        expect(result).to.eql({value: undefined, done: true});
    });
});
