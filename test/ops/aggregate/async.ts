import {_asyncValues, expect} from '../../header';
import {pipe, aggregate} from '../../../src/entry/async';

export default () => {
    it('must process data correctly', async () => {
        const output = pipe(
            [1, 2, 3],
            aggregate((arr) => {
                return arr.reduce((a, c) => a + c);
            })
        );
        expect(await _asyncValues(output)).to.eql([6]);
    });
    it('must handle empty iterables', async () => {
        const output = pipe(
            [],
            aggregate((arr) => {
                return arr;
            })
        );
        expect(await _asyncValues(output)).to.eql([[]]);
    });
    it('must allow return of nothing', async () => {
        const output = pipe(
            [],
            aggregate(() => {})
        );
        expect(await _asyncValues(output)).to.eql([undefined]);
    });
    it('must resolve a returned promise', async () => {
        const output = pipe(
            [1, 2, 3],
            aggregate(async (data) => {
                return data;
            })
        );
        expect(await _asyncValues(output)).to.eql([[1, 2, 3]]);
    });
};
