import {expect} from '../../header';
import {pipe, onEnd} from '../../../src/entry/sync';
import type {IIterationSummary} from '../../../src';

export default () => {
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
        expect(s.duration.total).to.be.greaterThanOrEqual(0);
        expect(s.duration.max).not.to.be.undefined;
        expect(s.duration.min).not.to.be.undefined;
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
        expect(s.duration).to.eql({
            average: 0,
            max: undefined,
            min: undefined,
            total: 0,
        });
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
};
