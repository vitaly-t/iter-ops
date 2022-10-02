import {_async, _asyncValues, expect} from '../../header';
import {pipe, delay} from '../../../src';

describe('delay', () => {
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

    describe('for negative timeout', () => {
        it('must not add delay for direct number', async () => {
            const output = pipe(_async([1]), delay(-100));
            const start = Date.now();
            await _asyncValues(output);
            const duration = Date.now() - start;
            expect(duration).to.be.lessThan(10);
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

    it('must throw on synchronous pipeline once', () => {
        const i = pipe([], delay(100))[Symbol.iterator]();
        expect(() => {
            i.next();
        }).to.throw('Operator "delay" requires asynchronous pipeline');
        expect(i.next()).to.eql({value: undefined, done: true});
    });
});
