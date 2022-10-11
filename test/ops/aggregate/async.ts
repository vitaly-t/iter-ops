import {_async, _asyncValues, expect} from '../../header';
import {pipe, aggregate} from '../../../src';

export default () => {
    it('must process data correctly', async () => {
        const output = pipe(
            _async([1, 2, 3]),
            aggregate((arr) => {
                return arr.reduce((a, c) => a + c);
            })
        );
        expect(await _asyncValues(output)).to.eql([6]);
    });
    it('must handle empty iterables', async () => {
        const output = pipe(
            _async([]),
            aggregate((arr) => {
                return arr;
            })
        );
        expect(await _asyncValues(output)).to.eql([[]]);
    });
    it('must allow return of nothing', async () => {
        const output = pipe(
            _async([]),
            aggregate(() => {})
        );
        expect(await _asyncValues(output)).to.eql([undefined]);
    });
};
