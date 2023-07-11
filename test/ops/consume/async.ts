import {_async, _asyncValues, expect} from '../../header';
import {pipe, consume} from '../../../src';

export default () => {
    it('must return sync consumer', async () => {
        let isSync;
        const output = pipe(
            _async([]),
            consume((data, sync) => {
                isSync = sync;
                return 'hello';
            }),
        );
        expect(await _asyncValues(output)).to.eql(['hello']);
        expect(isSync).to.be.false;
    });
    it('must return async consumer', async () => {
        const output = pipe(
            _async([]),
            consume(async () => 'hello'),
        );
        expect(await _asyncValues(output)).to.eql(['hello']);
    });
};
