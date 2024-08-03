import {_asyncValues, expect} from '../../header';
import {pipeAsync, tap, retry} from '../../../src';

export default () => {
    const source = pipeAsync(
        [1, 2, 3, 4, 5],
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
    it('must throw when failed for Promise', async () => {
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
    it('must pass correct callback parameters', async () => {
        const indexes: number[] = [],
            attempts: number[] = [];
        const i = pipeAsync(
            [11, 20, 33, 40, 55, 60, 77, 80, 99],
            tap((value) => {
                if (value % 2 === 0) {
                    throw new Error(`fail-${value}`); // throw for all even numbers
                }
            }),
            retry((idx, att) => {
                indexes.push(idx);
                attempts.push(att);
                return att < 1; // retry once
            })
        );
        expect(await _asyncValues(i)).to.eql([11, 33, 55, 77, 99]);
        expect(indexes).to.eql([1, 3, 5, 7]);
        expect(attempts).to.eql([0, 0, 0, 0]);
    });
};
