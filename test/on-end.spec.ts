import {_async, _asyncValues, expect} from './header';
import {pipe, delay, onEnd, IIterationSummary} from '../src';

describe('sync onEnd', () => {
    it('must notify for non-empty iterables', () => {
        let s: IIterationSummary<any> = {} as any;
        const i = pipe(
            [10, 20, 30],
            onEnd((info) => {
                s = info;
            })
        );
        expect([...i]).to.eql([10, 20, 30]);
        expect(s.sync).to.be.true;
        expect(s.count).to.eql(3);
        expect(s.lastValue).to.eq(30);
        expect(s.duration).to.be.greaterThanOrEqual(0);
    });
    it('must notify for empty iterables', () => {
        let s: IIterationSummary<any> = {} as any;
        const i = pipe(
            [],
            onEnd((info) => {
                s = info;
            })
        );
        expect([...i]).to.eql([]);
        expect(s.sync).to.be.true;
        expect(s.count).to.eql(0);
        expect(s.lastValue).to.be.undefined;
        expect(s.duration).to.be.greaterThanOrEqual(0);
    });
    it('must emit only once', () => {
        let count = 0;
        const i = pipe(
            [],
            onEnd(() => {
                count++;
            })
        )[Symbol.iterator]();
        i.next();
        i.next(); // after "done"
        expect(count).to.eq(1);
    });
});

describe('async onEnd', () => {
    it('must notify for non-empty iterables', async () => {
        let s: IIterationSummary<any> = {} as any;
        const i = pipe(
            _async([10, 20, 30]),
            delay(10),
            onEnd((info) => {
                s = info;
            })
        );
        expect(await _asyncValues(i)).to.eql([10, 20, 30]);
        expect(s.sync).to.be.false;
        expect(s.count).to.eql(3);
        expect(s.lastValue).to.eq(30);
        expect(s.duration).to.be.greaterThanOrEqual(10);
    });
    it('must measure timing from start', async () => {
        let s: IIterationSummary<any> = {} as any;
        const i = pipe(
            _async([1]),
            delay(10),
            onEnd((info) => {
                s = info;
            })
        );
        expect(await _asyncValues(i)).to.eql([1]);
        expect(s.duration).to.be.greaterThanOrEqual(10);
    });
    it('must notify for empty iterables', async () => {
        let s: IIterationSummary<any> = {} as any;
        const i = pipe(
            _async([]),
            onEnd((info) => {
                s = info;
            })
        );
        expect(await _asyncValues(i)).to.eql([]);
        expect(s.sync).to.be.false;
        expect(s.count).to.eql(0);
        expect(s.lastValue).to.be.undefined;
        expect(s.duration).to.be.greaterThanOrEqual(0);
    });
    it('must emit only once', async () => {
        let count = 0;
        const i = pipe(
            _async([]),
            onEnd(() => {
                count++;
            })
        )[Symbol.asyncIterator]();
        await i.next();
        await i.next(); // after "done"
        expect(count).to.eq(1);
    });
});
