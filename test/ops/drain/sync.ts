import {_async, expect} from '../../header';
import {pipeSync, drain, tap} from '../../../src';

export default () => {
    it('must pull all values', () => {
        const c: number[] = [];
        const i = pipeSync(
            [1, 2, 3],
            tap((a) => {
                c.push(a);
            }),
            drain()
        );
        expect(i.first).to.be.undefined;
        expect(c).to.eql([1, 2, 3]);
    });
};
