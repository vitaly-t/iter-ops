import {expect} from '../../header';
import {pipe, retry} from '../../../src';

export default () => {
    it('must throw on synchronous pipeline once', () => {
        const i = pipe([1, 2, 3], retry(2))[Symbol.iterator]();
        expect(() => {
            i.next();
        }).to.throw('Operator "retry" requires asynchronous pipeline');
        expect(i.next()).to.eql({value: undefined, done: true});
    });
};
