import {_async, _asyncValues, expect} from './header';
import {pipe, drain, tap} from '../src';

describe('sync drain', () => {
    it('must pull all values', () => {
        const c: number[] = [];
        const i = pipe(
            [1, 2, 3],
            tap(a => {
                c.push(a);
            }),
            drain()
        );
        expect(i.first).to.be.undefined;
        expect(c).to.eql([1, 2, 3]);
    });
});

describe('async drain', () => {
    it('must pull all values', async () => {
        const c: number[] = [];
        const i = pipe(
            _async([1, 2, 3]),
            tap(a => {
                c.push(a);
            }),
            drain()
        );
        expect(await i.first).to.be.undefined;
        expect(c).to.eql([1, 2, 3]);
    });
});
