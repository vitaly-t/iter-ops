import {expect} from '../../header';
import {pipe, consume} from '../../../src';

export default () => {
    it('must return consumer', () => {
        let isSync;
        const output = pipe(
            [],
            consume((data, sync) => {
                isSync = sync;
                return 'hello';
            }),
        );
        expect([...output]).to.eql(['hello']);
        expect(isSync).to.be.true;
    });
};
