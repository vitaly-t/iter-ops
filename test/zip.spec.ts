import {_async, _asyncValues, expect} from './header';
import {pipe, zip} from '../src';

function createIterator() {
    let value = false, index = 0;
    return {
        next() {
            if (index++ < 4) {
                value = !value;
                return {value, done: false};
            }
            return {value: undefined, done: true};
        }
    };
}

describe('sync zip', () => {
    it('must compress till first end', () => {
        const i = pipe([1, 2, 3], zip('here', createIterator()));
        expect([...i]).to.eql([[1, 'h', true], [2, 'e', false], [3, 'r', true]]);
    });
    it('must not retry once finished', () => {
        const i = pipe([1, 2, 3], zip('here'))[Symbol.iterator]();
        i.next() && i.next() && i.next() && i.next(); // iteration over here
        expect(i.next()).to.eql({value: undefined, done: true});
    });
    it('must work without arguments', () => {
        const i = pipe([1, 2, 3], zip());
        expect([...i]).to.eql([[1], [2], [3]]);
    });
});

describe('async zip', () => {
    it('must compress till first end', async () => {
        const i = pipe(_async([1, 2, 3]), zip('here', _async([11, 22, 33, 44]), createIterator()));
        expect(await _asyncValues(i)).to.eql([[1, 'h', 11, true], [2, 'e', 22, false], [3, 'r', 33, true]]);
    });
    it('must not retry once finished', async () => {
        const i = pipe(_async([1, 2, 3]), zip('here'))[Symbol.asyncIterator]();
        await Promise.all([i.next(), i.next(), i.next(), i.next()]); // iteration over here
        expect(await i.next()).to.eql({value: undefined, done: true});
    });
    it('must work without arguments', async () => {
        const i = pipe(_async([1, 2, 3]), zip());
        expect(await _asyncValues(i)).to.eql([[1], [2], [3]]);
    });
});
