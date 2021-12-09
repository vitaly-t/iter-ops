import {_async, _asyncValues, expect} from '../header';
import {pipe, map, retry} from '../../src';

describe('retry', () => {
    it('must retry number of attempts', async () => {
        const i = pipe(
            _async([1, 2, 3, 4, 5]),
            map((value, index, state) => {
                state[value] = (state[value] ?? -1) + 1;
                if (state[value] < 3) {
                    throw new Error(`Throw attempt ${state[value]} for value ${value}`);
                }
                return value;
            }),
            retry(3)
        );
        expect(await _asyncValues(i)).to.eql([1, 2, 3, 4, 5]);
    });
});
