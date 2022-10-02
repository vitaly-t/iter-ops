import {expect} from '../../header';
import {pipeSync, delay} from '../../../src';

export default () => {
    it('must throw on synchronous pipeline once', () => {
        const i = pipeSync([], delay(100) as any)[Symbol.iterator]();
        expect(() => {
            i.next();
        }).to.throw('Operator "delay" requires asynchronous pipeline');
        expect(i.next()).to.eql({value: undefined, done: true});
    });
};
