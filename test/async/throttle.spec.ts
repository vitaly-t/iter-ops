import {_async, _asyncValues, expect} from '../header';
import {pipe, throttle} from '../../src';

describe('throttle', () => {
    it('must emit after resolved', async () => {
        const output = pipe(_async([1]), throttle(() => Promise.resolve(123)));
        expect(await _asyncValues(output)).to.eql([1]);
    });
});
