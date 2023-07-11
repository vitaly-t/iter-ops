import {_asyncValues, expect} from '../../header';
import {pipeAsync, map, delay, waitRace} from '../../../src';

export default () => {
    it('must resolve all promises', async () => {
        const i = pipeAsync(
            [1, 2, 3, 4],
            map((a) => Promise.resolve(a)),
            waitRace(2),
        );
        expect(await _asyncValues(i)).to.have.members([1, 2, 3, 4]);
    });
    it('must resolve all simple values', async () => {
        const i = pipeAsync([1, 2, 3, 4], waitRace(2));
        expect(await _asyncValues(i)).to.have.members([1, 2, 3, 4]);
    });
    it('must resolve combinations of promises and simple values', async () => {
        const i = pipeAsync(
            [1, Promise.resolve(2), 3, Promise.resolve(4)],
            waitRace(2),
        );
        expect(await _asyncValues(i)).to.have.members([1, 2, 3, 4]);
    });
    it('must handle invalid size of cache', async () => {
        const i = pipeAsync([1, 2, Promise.resolve(3), 4], waitRace(-1));
        expect(await _asyncValues(i)).to.have.members([1, 2, 3, 4]);
    });
    it('must reject when a value rejects', async () => {
        const i = pipeAsync([1, Promise.reject(2) as any, 3], waitRace(2));
        let err;
        try {
            await _asyncValues(i);
        } catch (e) {
            err = e;
        }
        expect(err).to.eql(2);
    });
    it('must reject for async generators', async () => {
        const sleep = (n: number) =>
            new Promise((resolve) => setTimeout(resolve, n));

        async function* oops() {
            yield 123;
            await sleep(10);
            throw new Error('boom');
        }

        const i = pipeAsync(oops(), waitRace(2));
        let err = null;
        try {
            await _asyncValues(i);
        } catch (e) {
            err = e as Error;
        }
        expect(err?.message).to.eql('boom');
    });
    it('must allow rejected value replacement', async () => {
        const i = pipeAsync(
            [1, 2, 3, 4, 5],
            map(async (a) => {
                if (a % 2 === 0) {
                    throw a;
                }
                return a;
            }),
            waitRace(3),
        ).catch((err, ctx) => {
            ctx.emit(err * 10);
        });
        expect(await _asyncValues(i)).to.eql([1, 20, 3, 40, 5]);
    });
    it('must provide timely resolutions', async () => {
        const input = [1, 2, 3, 4, 5, 6, 7];
        const output: {value: number; delay: number}[] = [];
        const i = pipeAsync(
            input,
            delay(50),
            map((a) => Promise.resolve(a)),
            waitRace(5),
        );
        const start = Date.now();
        for await (const value of i) {
            const delay = Date.now() - start;
            output.push({value, delay});
        }
        expect(
            output.map((a) => a.value),
            'Missing resolution values',
        ).to.include.members(input);
        expect(
            output[0].delay,
            'First resolution took too long',
        ).to.be.lessThan(85);
        expect(
            output[1].delay,
            'Second resolution took too long',
        ).to.be.lessThan(145);
        expect(
            output[input.length - 1].delay,
            'Last resolution took too long',
        ).to.be.lessThan(470);
    });
};
