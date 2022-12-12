import {expect} from '../../header';
import {pipe, drain, tap} from '../../../src/entry/async';

export default () => {
    it('must pull all values', async () => {
        const c: number[] = [];
        const i = pipe(
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
