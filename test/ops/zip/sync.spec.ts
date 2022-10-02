import {expect} from '../../header';
import {pipe, zip} from '../../../src';
import {createIterator} from './header';

describe('sync zip', () => {
    it('must compress till first end', () => {
        const i = pipe([1, 2, 3], zip('here', createIterator()));
        expect([...i]).to.eql([
            [1, 'h', true],
            [2, 'e', false],
            [3, 'r', true],
        ]);
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
    it('must throw once on invalid inputs', () => {
        const i = pipe([1, 2, 3], zip(111 as any, 222 as any, 333 as any));
        let err: any;
        try {
            [...i];
        } catch (e) {
            err = e;
        }
        expect(err.message).to.eql('Value at index 0 is not iterable: 111');
    });
});
