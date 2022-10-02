import {expect} from '../../header';
import {pipeSync, throttle} from '../../../src';

export default () => {
    it('must throw on synchronous pipeline once', () => {
        const i = pipeSync([], throttle(() => Promise.resolve(123)) as any)[
            Symbol.iterator
        ]();
        expect(() => {
            i.next();
        }).to.throw('Operator "throttle" requires asynchronous pipeline');
        expect(i.next()).to.eql({value: undefined, done: true});
    });
};
