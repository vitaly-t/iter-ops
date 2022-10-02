import {expect} from '../../header';
import {pipeSync, map, wait} from '../../../src';

export default () => {
    it('must throw on synchronous pipeline once', () => {
        const i = pipeSync([], wait() as any)[Symbol.iterator]();
        expect(() => {
            i.next();
        }).to.throw('Operator "wait" requires asynchronous pipeline');
        expect(i.next()).to.eql({value: undefined, done: true});
    });
};
