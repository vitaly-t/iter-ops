import {expect} from '../../header';
import {pipeSync, empty} from '../../../src';

export default () => {
    it('must produce empty iterable', () => {
        const input = [1, 2, 3];
        const output = pipeSync(input, empty());
        expect([...output]).to.eql([]);
    });
};
