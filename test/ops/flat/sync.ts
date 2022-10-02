import {expect} from '../../header';
import {flat, pipeSync} from '../../../src';

export default () => {
    it('must flatten strings', () => {
        const output = pipeSync(['one', 'two'], flat());
        expect([...output]).to.eql(['o', 'n', 'e', 't', 'w', 'o']);
    });
    it('must flatten arrays', () => {
        const output = pipeSync(
            [
                [1, 2],
                [3, 4],
            ],
            flat()
        );
        expect([...output]).to.eql([1, 2, 3, 4]);
    });
    it('must flatten nested arrays to specified depth', () => {
        const output = pipeSync(
            [
                [1, 2],
                [3, [4, [5, 6], 7]],
            ],
            flat(2)
        );
        expect([...output]).to.eql([1, 2, 3, 4, [5, 6], 7]);
    });

    it('must handle empty iterables', () => {
        const output1 = pipeSync([], flat());
        const output2 = pipeSync([[]], flat());
        const output3 = pipeSync([[], []], flat());
        const output4 = pipeSync([''], flat());
        expect([...output1]).to.eql([]);
        expect([...output2]).to.eql([]);
        expect([...output3]).to.eql([]);
        expect([...output4]).to.eql([]);
    });
    it('must find values after empty', () => {
        const output = pipeSync([[], [1]], flat());
        expect([...output]).to.eql([1]);
    });
};
