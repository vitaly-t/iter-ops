import {expect} from '../../header';
import {pipeSync, page} from '../../../src';

export default () => {
    it('must handle divisible page sizes', () => {
        const input = [1, 2, 3, 4, 5, 6];
        const i = pipeSync(input, page(3));
        expect([...i]).to.eql([
            [1, 2, 3],
            [4, 5, 6],
        ]);
    });
    it('must handle non-divisible page sizes', () => {
        const input1 = [1, 2, 3, 4, 5];
        const i1 = pipeSync(input1, page(3));
        expect([...i1], 'more than 1 page').to.eql([
            [1, 2, 3],
            [4, 5],
        ]);

        const input2 = [1, 2];
        const i2 = pipeSync(input2, page(3));
        expect([...i2], 'less then 1 page').to.eql([[1, 2]]);
    });
    it('must handle empty iterables', () => {
        const i = pipeSync([], page(3));
        expect([...i]).to.eql([]);
    });
    it('must handle page size of 1', () => {
        const i = pipeSync([1, 2, 3], page(1));
        expect([...i]).to.eql([[1], [2], [3]]);
    });
    it('must throw during iteration when page size < 1 or invalid', () => {
        const errMsg = (value: any) =>
            `Page size >= 1 is required: ${JSON.stringify(value)}`;
        expect(() => {
            pipeSync([], page(0)).first;
        }).to.throw(errMsg(0));
        expect(() => {
            pipeSync([], page(-1)).first;
        }).to.throw(errMsg(-1));
        expect(() => {
            pipeSync([], page('bla' as any)).first;
        }).to.throw(errMsg('bla'));
    });
};
