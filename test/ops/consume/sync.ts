import {expect} from '../../header';
import {pipe, consume} from '../../../src';

export default () => {
    it('must return consumer', () => {
        const output = pipe(
            [],
            consume(() => 'hello')
        );
        expect([...output]).to.eql(['hello']);
    });
};
