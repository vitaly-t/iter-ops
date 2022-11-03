import {expect} from '../../header';
import {pipe, waitCache} from '../../../src';

export default () => {
    it('must throw on synchronous pipeline once', () => {
        const i = pipe([], waitCache(1) as any)[Symbol.iterator]();
        expect(() => {
            i.next();
        }).to.throw('Operator "waitCache" requires asynchronous pipeline');
        expect(i.next()).to.eql({value: undefined, done: true});
    });
};
