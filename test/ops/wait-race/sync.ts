import {expect} from '../../header';
import {pipe, waitRace} from '../../../src';

export default () => {
    it('must forward to the source', () => {
        const source = [1, 2, 3];
        const i = pipe(source, waitRace(1));
        expect([...i]).to.eql(source);
    });
};
