import {expect} from '../../header';
import {pipe, some} from '../../../src/entry/sync';

export default () => {
    it('must find element when present', () => {
        const i = pipe(
            [1, 2, 3],
            some((a) => a === 2)
        );
        expect([...i]).to.eql([true]);
    });
    it('must work without match', () => {
        const i = pipe(
            [1, 2, 3],
            some((a) => a === 5)
        );
        expect([...i]).to.eql([false]);
    });
};
