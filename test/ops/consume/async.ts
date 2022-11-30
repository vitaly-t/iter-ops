import {_async, _asyncValues, expect} from '../../header';
import {pipe, consume} from '../../../src';

export default () => {
    it('must return sync consumer', async () => {
        const output = pipe(
            _async([]),
            consume(() => 'hello')
        );
        expect(await _asyncValues(output)).to.eql(['hello']);
    });
    it('must return async consumer', async () => {
        const output = pipe(
            _async([]),
            consume(async () => 'hello')
        );
        expect(await _asyncValues(output)).to.eql(['hello']);
    });
};
