import {_async, _asyncValues, expect} from '../../header';
import {IValueTiming, pipe, timing, delay} from '../../../src';

describe('sync timing', () => {
    it('must emit correct timings', () => {
        const c: IValueTiming<number>[] = [];
        const i = pipe(
            [10, 20, 30],
            timing((t) => {
                c.push(t);
            })
        );
        expect([...i]).to.eql([10, 20, 30]);
        expect(c.length).to.eql(3);
        expect(
            c[0].index === 0 &&
                c[0].value === 10 &&
                c[0].duration >= 0 &&
                c[0].sync
        ).to.be.true;
        expect(
            c[1].index === 1 &&
                c[1].value === 20 &&
                c[1].duration >= 0 &&
                c[1].sync
        ).to.be.true;
        expect(
            c[2].index === 2 &&
                c[2].value === 30 &&
                c[2].duration >= 0 &&
                c[2].sync
        ).to.be.true;
    });
});

describe('async timing', () => {
    it('must emit correct timings', async () => {
        const c: IValueTiming<number>[] = [];
        const i = pipe(
            _async([10, 20, 30]),
            delay(4),
            timing((t) => {
                c.push(t);
            })
        );
        expect(await _asyncValues(i)).to.eql([10, 20, 30]);
        expect(c.length).to.eql(3);
        expect(
            c[0].index === 0 &&
                c[0].value === 10 &&
                c[0].duration >= 3 &&
                !c[0].sync
        ).to.be.true;
        expect(
            c[1].index === 1 &&
                c[1].value === 20 &&
                c[1].duration >= 3 &&
                !c[1].sync
        ).to.be.true;
        expect(
            c[2].index === 2 &&
                c[2].value === 30 &&
                c[2].duration >= 3 &&
                !c[2].sync
        ).to.be.true;
    });
});
