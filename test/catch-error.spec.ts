import {_async, _asyncValues, expect} from './header';
import {pipe, tap, catchError} from '../src';
import {AsyncIterableExt} from "../dist";

describe('sync catchError', () => {
    it('must continue without value', () => {
        const reports: any[] = [];
        const i = pipe(
            [1, 2, 3, 4, 5],
            tap(value => {
                if (value === 3) {
                    throw new Error(`ops-${value}`);
                }
            }),
            catchError((err, info) => {
                reports.push({err: err?.message, index: info.index, lastValue: info.lastValue});
            })
        );
        const result = [...i];
        expect(result).to.eql([1, 2, 4, 5]);
        expect(reports).to.eql([{err: 'ops-3', index: 2, lastValue: 2}]);
    });
    it('must inject a manually emitted value', () => {
        const i = pipe(
            [1, 2, 3, 4, 5],
            tap(value => {
                if (value === 3) {
                    throw new Error(`ops-${value}`);
                }
            })
        )
            .catch((err, info) => {
                info.emit(333);
            });
        const result = [...i];
        expect(result).to.eql([1, 2, 333, 4, 5]);
    });
    it('must allow re-throwing', () => {
        const i = pipe(
            [1],
            tap(() => {
                throw new Error('ops');
            }),
            catchError(() => {
                throw new Error('handled');
            })
        );
        expect(() => {
            [...i];
        }).to.throw('handled');
    });
});

describe('async catchError', () => {
    it('must continue without value', async () => {
        const reports: any[] = [];
        const i = pipe(
            _async([1, 2, 3, 4, 5]),
            tap(value => {
                if (value === 3) {
                    throw new Error(`ops-${value}`);
                }
            }),
            catchError((err, info) => {
                reports.push({err: err?.message, index: info.index, lastValue: info.lastValue});
            })
        );
        const result = await _asyncValues(i);
        expect(result).to.eql([1, 2, 4, 5]);
        expect(reports).to.eql([{err: 'ops-3', index: 2, lastValue: 2}]);
    });
    it('must inject a manually emitted value', async () => {
        const i = pipe(
            _async([1, 2, 3, 4, 5]),
            tap(value => {
                if (value === 3) {
                    throw new Error(`ops-${value}`);
                }
            })
        )
            .catch((err, info) => {
                info.emit(333);
            });
        const result = await _asyncValues(i);
        expect(result).to.eql([1, 2, 333, 4, 5]);
    });
    // TODO: Rethrowing doesn't work:
    /*
    it('must allow re-throwing', () => {
        const i = pipe(
            _async([1]),
            tap(() => {
                throw new Error('ops');
            }),
            catchError(() => {
                throw new Error('handled');
            })
        );
        expect(async () => {
            await _asyncValues(i);
        }).to.throw('handled');
    });*/
});
