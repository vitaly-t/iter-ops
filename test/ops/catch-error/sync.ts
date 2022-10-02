import {_async, _asyncValues, expect, YSNP} from '../../header';
import {pipeSync, tap, catchError} from '../../../src';

export default () => {
    it('must continue without value', () => {
        const reports: any[] = [];
        const i = pipeSync(
            [1, 2, 3, 4, 5],
            tap((value) => {
                if (value === 3) {
                    throw new Error(`ops-${value}`);
                }
            }),
            catchError((err, ctx) => {
                reports.push({
                    err: err?.message,
                    index: ctx.index,
                    lastValue: ctx.lastValue,
                    repeats: ctx.repeats,
                });
            })
        );
        const result = [...i];
        expect(result).to.eql([1, 2, 4, 5]);
        expect(reports).to.eql([
            {err: 'ops-3', index: 2, lastValue: 2, repeats: 0},
        ]);
    });
    it('must report repeated errors', () => {
        const repeatCounts: number[] = [];
        const i = pipeSync(
            [1, 2, 3, 4, 5],
            tap(() => {
                throw 'ops!';
            })
        ).catch((e, ctx) => {
            if (ctx.repeats > 2) {
                throw 'stop';
            }
            repeatCounts.push(ctx.repeats);
        });
        let err: any;
        try {
            [...i];
            YSNP();
        } catch (e) {
            err = e;
        }
        expect(err).to.eql('stop');
        expect(repeatCounts).to.eql([0, 1, 2]);
    });
    it('must inject a manually emitted value', () => {
        const i = pipeSync(
            [1, 2, 3, 4, 5],
            tap((value) => {
                if (value === 3) {
                    throw new Error(`ops-${value}`);
                }
            })
        ).catch((err, info) => {
            info.emit(333);
        });
        const result = [...i];
        expect(result).to.eql([1, 2, 333, 4, 5]);
    });
    it('must allow re-throwing', () => {
        const i = pipeSync(
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
};
