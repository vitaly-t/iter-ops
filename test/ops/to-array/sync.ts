import {expect} from '../../header';
import {pipeSync, toArray} from '../../../src';

export default () => {
    it('must recreate input array', () => {
        const input = [1, 2, 3];
        const output = pipeSync(input, toArray());
        expect(output.first).to.eql(input);
    });
    it('must not generate more than one value', () => {
        const input = [1, 2];
        const output = pipeSync(input, toArray());
        const i = output[Symbol.iterator]();
        const result = i.next() && i.next();
        expect(result).to.eql({value: undefined, done: true});
    });
};
