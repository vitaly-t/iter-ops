import {expect} from '../../header';
import {flatMap, pipe} from '../../../src';

export default () => {
    it('must flatten all iterables', () => {
        const output = pipe(
            ['one', 'two', 123],
            flatMap((a) => a)
        );
        expect([...output]).to.eql(['o', 'n', 'e', 't', 'w', 'o', 123]);
    });
    it('must spread remapped values', () => {
        const output = pipe(
            ['one', 1, 2, [3]],
            flatMap((a) => [a])
        );
        expect([...output]).to.eql(['one', 1, 2, [3]]);
    });
};
