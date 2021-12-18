import {_async, expect} from './header';
import {pipe, combine} from '../src';

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

describe('sync combine', () => {
    it('must combine all values', () => {
        const i = pipe([1, 2, 3], combine('here!', createIterator()));
        expect([...i]).to.eql([[1, 'h', true], [2, 'e', false], [3, 'r', true], [3, 'e', false], [3, '!', false]]);
    });
    it('must allow non-starters', () => {
        const i = pipe([1, 2, 3], combine([]));
        expect([...i]).to.eql([]);
    });
    it('must not retry once finished', () => {
        const i = pipe([1, 2, 3], combine('here'))[Symbol.iterator]();
        i.next() && i.next() && i.next() && i.next() && i.next(); // iteration over here
        expect(i.next()).to.eql({value: undefined, done: true});
    });
    it('must work without arguments', () => {
        const i = pipe([1, 2, 3], combine());
        expect([...i]).to.eql([[1], [2], [3]]);
    });
});

describe('async combine', () => {
    // TODO: This is temporary, until implemented.
    it('must throw an error on any iteration attempt', async () => {
        const i = pipe(_async([1, 2, 3]), combine('ops'));
        let err: any;
        try {
            await i.first;
        } catch (e) {
            err = e;
        }
        expect(err.message).to.eql('Asynchronous version of operator "combine" does not exist');
    });
});
