import {expect} from './header';
import {pipe, split} from '../src';

describe('split', () => {
    describe('without options', () => {
        it('must do regular split', () => {
            const i = pipe('one two three', split(a => a === ' '));
            expect([...i]).to.eql([['o', 'n', 'e'], ['t', 'w', 'o'], ['t', 'h', 'r,', 'e', 'e']]);
        });
        it('must process gaps correctly', () => {
            // TODO: It is important to remember why split() can only emit empty arrays for empty lists,
            //  and it is because the result signature has to be compatible with the spread() operator.
            //  This has been added to the "trim" option documentation.
            const i = pipe([0, 1, 2, 0, 3, 4, 0, 0], split(a => a === 0));
            expect([...i]).to.eql([[], [1, 2], [3, 4], [], []]);
        });
    });
    describe('with option', () => {
        describe('trim', () => {
            it('must discard empty arrays', () => {
                const i = pipe([0, 1, 2, 0, 0, 3, 4, 0, 0], split(a => a === 0));
                expect([...i]).to.eql([[1, 2], [3, 4]]);
            });
        });
    });
});
