import {expect} from '../../header';
import {flat, pipe} from '../../../src';

export default () => {
    it('must flatten strings', () => {
        const output = pipe(['one', 'two'], flat());
        expect([...output]).to.eql(['o', 'n', 'e', 't', 'w', 'o']);
    });
    it('must support skip logic', () => {
        let level;
        const output = pipe(
            ['one', 'two'],
            flat(1, (v, l) => {
                level = l;
                return v === 'two';
            })
        );
        expect([...output]).to.eql(['o', 'n', 'e', 'two']);
        expect(level).to.eql(0);
    });
    it('must flatten arrays', () => {
        const output = pipe(
            [[1, 2], [3, 4], 'word!'],
            flat(1, (v) => typeof v === 'string')
        );
        expect([...output]).to.eql([1, 2, 3, 4, 'word!']);
    });
    it('must flatten nested arrays to specified depth', () => {
        const output = pipe(
            [
                [1, 2],
                [3, [4, [5, 6], 7]]
            ],
            flat(2)
        );
        expect([...output]).to.eql([1, 2, 3, 4, [5, 6], 7]);
    });

    it('must handle empty iterables', () => {
        const output1 = pipe([], flat());
        const output2 = pipe([[]], flat());
        const output3 = pipe([[], []], flat());
        const output4 = pipe([''], flat());
        expect([...output1]).to.eql([]);
        expect([...output2]).to.eql([]);
        expect([...output3]).to.eql([]);
        expect([...output4]).to.eql([]);
    });
    it('must find values after empty', () => {
        const output = pipe([[], [1]], flat());
        expect([...output]).to.eql([1]);
    });
};
