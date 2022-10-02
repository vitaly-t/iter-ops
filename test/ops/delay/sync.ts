import {expect} from '../../header';
import {pipe, delay} from '../../../src';

export default () => {
    it('must throw on synchronous pipeline once', () => {
        const i = pipe([], delay(100))[Symbol.iterator]();
        expect(() => {
            i.next();
        }).to.throw('Operator "delay" requires asynchronous pipeline');
        expect(i.next()).to.eql({value: undefined, done: true});
    });
};
