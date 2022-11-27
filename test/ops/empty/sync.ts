import {expect} from '../../header';
import {pipe, empty} from '../../../src/entry/sync';

export default () => {
    it('must produce empty iterable', () => {
        const input = [1, 2, 3];
        const output = pipe(input, empty());
        expect([...output]).to.eql([]);
    });
};
