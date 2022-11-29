import {_async, _asyncValues, expect} from '../../header';
import {pipe, concurrencyFork} from '../../../src';

export default () => {
    it('must default to the source', async () => {
        const input = [1, 2, 3];
        const output = pipe(
            _async(input),
            concurrencyFork({})
        );
        expect(await _asyncValues(output)).to.eql(input);
    });
    it('must return the result', async () => {
        const input = [1, 2, 3];
        const output = pipe(
            _async(input),
            concurrencyFork({
                onAsync() {
                    return _async(['one', 'two']);
                }
            })
        );
        expect(await _asyncValues(output)).to.eql(['one', 'two']);
    });
};
