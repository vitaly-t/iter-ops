import {expect} from '../../header';
import {flatMap, pipeSync} from '../../../src';

export default () => {
    it('must flatten all iterables', () => {
        const output = pipeSync(
            ['one', 'two', 123],
            flatMap((a) => a)
        );
        expect([...output]).to.eql(['o', 'n', 'e', 't', 'w', 'o', 123]);
    });
    it('must spread re-mapped values', () => {
        const output = pipeSync(
            ['one', 1, 2, [3]],
            flatMap((a) => [a])
        );
        expect([...output]).to.eql(['one', 1, 2, [3]]);
    });
};
