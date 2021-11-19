import {expect} from './header';
import {pipe, tap, catchError} from '../src';

describe('catchError', () => {
    it('must continue without value', () => {
        const reports: any[] = [];
        const i = pipe(
            [1, 2, 3, 4, 5],
            tap(value => {
                if (value > 2) {
                    throw new Error(`ops-${value}`);
                }
            }),
            catchError((err, index, lastValue) => {
                reports.push({err: err?.message, index, lastValue});
                return lastValue ? lastValue * 10 : 0;
            })
        );
        const result = [...i];
        expect(result).to.eql([1, 2, 20, 20, 20]);
        expect(reports[0]).to.eql({err: 'ops-3', index: 2, lastValue: 2});
        expect(reports[1]).to.eql({err: 'ops-4', index: 3, lastValue: 2});
        expect(reports[2]).to.eql({err: 'ops-5', index: 4, lastValue: 2});
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
