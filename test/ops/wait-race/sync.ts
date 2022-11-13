import {expect} from '../../header';
import {pipe, waitRace} from '../../../src';

export default () => {
    it('must throw on synchronous pipeline once', () => {
        const i = pipe([], waitRace(1) as any)[Symbol.iterator]();
        expect(() => {
            i.next();
        }).to.throw('Operator "waitRace" requires asynchronous pipeline');
        expect(i.next()).to.eql({value: undefined, done: true});
    });
};
