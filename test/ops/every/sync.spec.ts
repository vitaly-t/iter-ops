import {expect} from '../../header';
import {pipe, every} from '../../../src';

describe('sync every', () => {
    it('must signal when all passed', () => {
        const i = pipe(
            [1, 2, 3],
            every((a) => a < 5)
        );
        expect([...i]).to.eql([true]);
    });
    it('must work without full match', () => {
        const i = pipe(
            [1, 2, 3],
            every((a) => a > 5)
        );
        expect([...i]).to.eql([false]);
    });
});
