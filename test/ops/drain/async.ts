import {expect} from '../../header';
import {pipeAsync, drain, tap} from '../../../src';

export default () => {
    it('must pull all values', async () => {
        const c: number[] = [];
        const i = pipeAsync(
            [1, 2, 3],
            tap((a) => {
                c.push(a);
            }),
            drain()
        );
        expect(await i.first).to.be.undefined;
        expect(c).to.eql([1, 2, 3]);
    });
};
