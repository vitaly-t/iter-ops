import {_asyncValues, expect} from '../../header';
import {pipe, every} from '../../../src/entry/async';

export default () => {
    it('must signal when all passed', async () => {
        const i = pipe(
            [1, 2, 3],
            every((a) => a < 5)
        );
        expect(await _asyncValues(i)).to.eql([true]);
    });
    it('must signal when all async passed', async () => {
        const i = pipe(
            [1, 2, 3],
            every(async (a) => a < 5)
        );
        expect(await _asyncValues(i)).to.eql([true]);
    });
    it('must work without full match', async () => {
        const i = pipe(
            [1, 2, 3],
            every((a) => a > 5)
        );
        expect(await _asyncValues(i)).to.eql([false]);
    });
    it('must work without full async match', async () => {
        const i = pipe(
            [1, 2, 3],
            every(async (a) => a > 5)
        );
        expect(await _asyncValues(i)).to.eql([false]);
    });
};
