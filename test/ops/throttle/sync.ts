import {expect} from '../../header';
import {pipe, throttle} from '../../../src';

export default () => {
    it('must throw on synchronous pipeline once', () => {
        const i = pipe(
            [],
            throttle(() => Promise.resolve(123))
        )[Symbol.iterator]();
        expect(() => {
            i.next();
        }).to.throw('Operator "throttle" requires asynchronous pipeline');
        expect(i.next()).to.eql({value: undefined, done: true});
    });
};
