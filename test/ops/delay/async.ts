import {_async, _asyncValues, expect} from '../../header';
import {pipe, delay, consume} from '../../../src';

export default () => {
    it('must emit after count', async () => {
        const output = pipe(_async([1]), delay(51));
        const start = Date.now();
        await _asyncValues(output);
        const duration = Date.now() - start;
        expect(duration).to.be.greaterThanOrEqual(50);
    });
    it('must emit after callback count', async () => {
        const output = pipe(
            _async([1]),
            delay(() => 51)
        );
        const start = Date.now();
        await _asyncValues(output);
        const duration = Date.now() - start;
        expect(duration).to.be.greaterThanOrEqual(50);
    });
    it('must not add delay for empty iterables', async () => {
        const output = pipe(_async([]), delay(100));
        const start = Date.now();
        await _asyncValues(output);
        const duration = Date.now() - start;
        expect(duration).to.be.lessThan(10);
    });
    describe('for negative timeouts', () => {
        it('must reuse the source iterable', async () => {
            const source = _async([1, 2, 3]);
            let lastIterable;
            const output = pipe(
                source,
                delay(-100),
                consume((c) => {
                    lastIterable = c;
                })
            );
            await _asyncValues(output);
            expect(lastIterable).to.eq(source);
        });
        it('must not add delay for callback result', async () => {
            const output = pipe(
                _async([1]),
                delay(() => -100)
            );
            const start = Date.now();
            await _asyncValues(output);
            const duration = Date.now() - start;
            expect(duration).to.be.lessThan(10);
        });
    });
};
