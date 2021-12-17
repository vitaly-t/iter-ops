import {_async, _asyncValues, expect} from './header';
import {pipe, onEnd, IIterationSummary} from '../src';

describe('sync onEnd', () => {
    it('must notify for non-empty iterables', () => {
        let s: IIterationSummary<any> = {} as any;
        const i = pipe([1, 2, 3], onEnd(info => {
            s = info;
        }));
        expect([...i]).to.eql([1, 2, 3]);
        expect(s.sync).to.be.true;
        expect(s.count).to.eql(3);
        expect(s.lastValue).to.eq(3);
        expect(s.duration).to.eq(0); // must be instant when synchronous
    });
    it('must notify for empty iterables', () => {
        let s: IIterationSummary<any> = {} as any;
        const i = pipe([], onEnd(info => {
            s = info;
        }));
        expect([...i]).to.eql([]);
        expect(s.sync).to.be.true;
        expect(s.count).to.eql(0);
        expect(s.lastValue).to.be.undefined;
        expect(s.duration).to.eq(0); // must be instant when synchronous
    });
    it('must emit only once', () => {
        let count = 0;
        const i = pipe([], onEnd(() => {
            count++;
        }))[Symbol.iterator]();
        i.next();
        i.next(); // after "done"
        expect(count).to.eq(1);
    });
});

describe('async onEnd', () => {
    it('must notify for non-empty iterables', async () => {
        let s: IIterationSummary<any> = {} as any;
        const i = pipe(_async([1, 2, 3]), onEnd(info => {
            s = info;
        }));
        expect(await _asyncValues(i)).to.eql([1, 2, 3]);
        expect(s.sync).to.be.false;
        expect(s.count).to.eql(3);
        expect(s.lastValue).to.eq(3);
        expect(s.duration).to.eq(0); // must be instant when synchronous
    });
    it('must notify for empty iterables', async () => {
        let s: IIterationSummary<any> = {} as any;
        const i = pipe(_async(), onEnd(info => {
            s = info;
        }));
        expect(await _asyncValues(i)).to.eql([]);
        expect(s.sync).to.be.false;
        expect(s.count).to.eql(0);
        expect(s.lastValue).to.be.undefined;
        expect(s.duration).to.eq(0); // must be instant when synchronous
    });
    it('must emit only once', async () => {
        let count = 0;
        const i = pipe(_async(), onEnd(() => {
            count++;
        }))[Symbol.asyncIterator]();
        await i.next();
        await i.next(); // after "done"
        expect(count).to.eq(1);
    });
});
