import {expect} from '../../header';
import {pipe, wait} from '../../../src';

export default () => {
    it('must forward to the source', () => {
        const source = [1, 2, 3];
        const i = pipe(source, wait());
        expect([...i]).to.eql(source);
    });
};
