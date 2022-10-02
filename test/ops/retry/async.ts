import {_async, _asyncValues, expect} from '../../header';
import {pipeAsync, tap, retry} from '../../../src';

export default () => {
    const source = pipeAsync(
        _async([1, 2, 3, 4, 5]),
        tap((value, index) => {
            if (index < 2) {
                throw new Error(`Throw for value ${value}`);
            }
            return value;
        })
    );
    it('must retry number of attempts', async () => {
        const i = pipeAsync(source, retry(2));
        expect(await _asyncValues(i)).to.eql([3, 4, 5]);
    });
    it('must retry while resolves with true', async () => {
        const i = pipeAsync(
            source,
            retry((index, attempts) => Promise.resolve(attempts < 3))
        );
        expect(await _asyncValues(i)).to.eql([3, 4, 5]);
    });
    it('must retry while returns true', async () => {
        const i = pipeAsync(
            source,
            retry((index, attempts) => attempts < 3)
        );
        expect(await _asyncValues(i)).to.eql([3, 4, 5]);
    });

    it('must throw when failed for number', async () => {
        const i = pipeAsync(source, retry(1));
        let err: any;
        try {
            await _asyncValues(i);
        } catch (e) {
            err = e;
        }
        expect(err?.message).to.eql('Throw for value 2');
    });
    it('must throw when failed for promise', async () => {
        const i = pipeAsync(
            source,
            retry((index, attempts) => Promise.resolve(attempts < 1))
        );
        let err: any;
        try {
            await _asyncValues(i);
        } catch (e) {
            err = e;
        }
        expect(err?.message).to.eql('Throw for value 2');
    });
    it('must throw when failed for boolean', async () => {
        const i = pipeAsync(
            source,
            retry((index, attempts) => attempts < 1)
        );
        let err: any;
        try {
            await _asyncValues(i);
        } catch (e) {
            err = e;
        }
        expect(err?.message).to.eql('Throw for value 2');
    });
};
