import {_async, _asyncValues, expect} from '../../header';
import {pipe, concurrencyFork} from '../../../src';

export default () => {
    it('must default to the source', async () => {
        const input = [1, 2, 3];
        const output = pipe(_async(input), concurrencyFork({}));
        expect(await _asyncValues(output)).to.eql(input);
    });
    it('must return the result', async () => {
        const input = [1, 2, 3];
        const output = pipe(
            _async(input),
            concurrencyFork({
                onAsync() {
                    return _async(['one', 'two']);
                },
            }),
        );
        expect(await _asyncValues(output)).to.eql(['one', 'two']);
    });
    it('must redirect callback errors', async () => {
        let err: Error | undefined;
        const output = pipe(
            _async([]),
            concurrencyFork({
                onAsync() {
                    throw new Error('ops!');
                },
            }),
        ).catch((e) => {
            err = e;
        });
        await _asyncValues(output);
        expect(err?.message).to.eq('ops!');
    });
};
