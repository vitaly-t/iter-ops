import {expect} from '../../header';
import {pipeSync, delay, onEnd, IIterationSummary} from '../../../src';

export default () => {
    it('must notify for non-empty iterables', () => {
        let s: IIterationSummary<any> = {} as any;
        const i = pipeSync(
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
        const i = pipeSync(
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
        const i = pipeSync(
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
