import {_async, _asyncValues, expect} from './header';
import {pipe, every} from '../src';

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

describe('async every', () => {
    it('must signal when all passed', async () => {
        const i = pipe(
            _async([1, 2, 3]),
            every((a) => a < 5)
        );
        expect(await _asyncValues(i)).to.eql([true]);
    });
    it('must signal when all async passed', async () => {
        const i = pipe(
            _async([1, 2, 3]),
            every(async (a) => a < 5)
        );
        expect(await _asyncValues(i)).to.eql([true]);
    });
    it('must work without full match', async () => {
        const i = pipe(
            _async([1, 2, 3]),
            every((a) => a > 5)
        );
        expect(await _asyncValues(i)).to.eql([false]);
    });
    it('must work without full async match', async () => {
        const i = pipe(
            _async([1, 2, 3]),
            every(async (a) => a > 5)
        );
        expect(await _asyncValues(i)).to.eql([false]);
    });
});
