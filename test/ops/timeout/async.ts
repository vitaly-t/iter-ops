import {_asyncValues, expect} from '../../header';
import {pipeAsync, delay, timeout} from '../../../src';

export default () => {
    it('must end iteration after timeout', async () => {
        const i = pipeAsync([1, 2, 3], delay(10), timeout(35));
        expect(await _asyncValues(i)).to.eql([1, 2]);
    });
    it('must emit nothing when timeout does not permit', async () => {
        const i = pipeAsync([1, 2, 3], delay(10), timeout(1));
        expect(await _asyncValues(i)).to.eql([]);
    });
    it('must invoke callback on timeout', async () => {
        let count;
        const i = pipeAsync(
            [1, 2, 3],
            delay(10),
            timeout(29, (c) => {
                count = c;
            })
        );
        expect(await _asyncValues(i)).to.eql([1, 2]);
        expect(count).to.eql(2);
    });
    it('must not invoke callback without timeout', async () => {
        let invoked = false;
        const i = pipeAsync(
            [1, 2, 3],
            timeout(1, () => {
                invoked = true;
            })
        );
        await _asyncValues(i); // iterate
        expect(invoked).to.be.false; // no callback
    });
    it('must deactivate on negative timeouts', async () => {
        const i = pipeAsync([1, 2, 3], timeout(-1));
        expect(await _asyncValues(i)).to.eql([1, 2, 3]);
    });
    it('must pass on callback errors', async () => {
        let e: any;
        const i = pipeAsync(
            [1, 2, 3],
            delay(10),
            timeout(1, () => {
                throw new Error('timeout');
            })
        ).catch((err) => {
            e = err;
        });
        await _asyncValues(i);
        expect(e?.message).to.eql('timeout');
    });
};
