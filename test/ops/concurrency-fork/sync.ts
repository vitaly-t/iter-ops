import {expect} from '../../header';
import {pipe, concurrencyFork} from '../../../src';

export default () => {
    it('must default to the source', () => {
        const input = [1, 2, 3];
        const output = pipe(
            input,
            concurrencyFork({})
        );
        expect([...output]).to.eql(input);
    });
    it('must return the result', () => {
        const input = [1, 2, 3];
        const output = pipe(
            input,
            concurrencyFork({
                onSync() {
                    return ['one', 'two'];
                }
            })
        );
        expect([...output]).to.eql(['one', 'two']);
    });
};
