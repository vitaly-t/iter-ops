import {_async, _asyncValues, expect} from '../../header';
import {pipe, delay, timeout} from '../../../src';

export default () => {
    it('must end iteration after timeout', async () => {
        const i = pipe(_async([1, 2, 3]), delay(20), timeout(55));
        expect(await _asyncValues(i)).to.eql([1, 2]);
    });
    it('must invoke callback on timeout', async () => {
        let count;
        const i = pipe(
            _async([1, 2, 3]),
            delay(10),
            timeout(18, (c) => {
                count = c;
            })
        );
        await _asyncValues(i); // iterate
        expect(count).to.eql(2);
    });
    it('must not invoke callback without timeout', async () => {
        let invoked = false;
        const i = pipe(
            _async([1, 2, 3]),
            timeout(10, () => {
                invoked = true;
            })
        );
        await _asyncValues(i); // iterate
        expect(invoked).to.be.false; // no callback
    });
    it('must deactivate on negative timeouts', async () => {
        const i = pipe(_async([1, 2, 3]), timeout(-1));
        expect(await _asyncValues(i)).to.eql([1, 2, 3]);
    });
};
