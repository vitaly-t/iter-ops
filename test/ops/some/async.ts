import {_async, _asyncValues, expect} from '../../header';
import {pipeAsync, some} from '../../../src';

export default () => {
    it('must find element when present', async () => {
        const i = pipeAsync(
            _async([1, 2, 3]),
            some((a) => a === 2)
        );
        expect(await _asyncValues(i)).to.eql([true]);
    });
    it('must find async element when present', async () => {
        const i = pipeAsync(
            _async([1, 2, 3]),
            some(async (a) => a === 2)
        );
        expect(await _asyncValues(i)).to.eql([true]);
    });
    it('must work without match', async () => {
        const i = pipeAsync(
            _async([1, 2, 3]),
            some((a) => a === 5)
        );
        expect(await _asyncValues(i)).to.eql([false]);
    });
    it('must work without async match', async () => {
        const i = pipeAsync(
            _async([1, 2, 3]),
            some(async (a) => a === 5)
        );
        expect(await _asyncValues(i)).to.eql([false]);
    });
};
