import {_async, _asyncValues, expect} from './header';
import {pipe, some} from '../src';

describe('sync some', () => {
    it('must find element when present', () => {
        const i = pipe(
            [1, 2, 3],
            some((a) => a === 2)
        );
        expect([...i]).to.eql([true]);
    });
    it('must work without match', () => {
        const i = pipe(
            [1, 2, 3],
            some((a) => a === 5)
        );
        expect([...i]).to.eql([false]);
    });
});

describe('async some', () => {
    it('must find element when present', async () => {
        const i = pipe(
            _async([1, 2, 3]),
            some((a) => a === 2)
        );
        expect(await _asyncValues(i)).to.eql([true]);
    });
    it('must find async element when present', async () => {
        const i = pipe(
            _async([1, 2, 3]),
            some(async (a) => a === 2)
        );
        expect(await _asyncValues(i)).to.eql([true]);
    });
    it('must work without match', async () => {
        const i = pipe(
            _async([1, 2, 3]),
            some((a) => a === 5)
        );
        expect(await _asyncValues(i)).to.eql([false]);
    });
    it('must work without async match', async () => {
        const i = pipe(
            _async([1, 2, 3]),
            some(async (a) => a === 5)
        );
        expect(await _asyncValues(i)).to.eql([false]);
    });
});
