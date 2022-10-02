import {expect} from '../../header';
import {pipeSync, some} from '../../../src';

export default () => {
    it('must find element when present', () => {
        const i = pipeSync(
            [1, 2, 3],
            some((a) => a === 2)
        );
        expect([...i]).to.eql([true]);
    });
    it('must work without match', () => {
        const i = pipeSync(
            [1, 2, 3],
            some((a) => a === 5)
        );
        expect([...i]).to.eql([false]);
    });
};
