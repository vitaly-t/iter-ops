import {expect} from '../../header';
import {pipe, retry, tap} from '../../../src';

export default () => {
    it('must not retry on 0 attempts', () => {
        let count = 0;
        const i = pipe(
            [1, 2, 3],
            tap(() => {
                if (!count++) {
                    throw 'ops!'; // throw only once
                }
            }),
            retry(0)
        );
        expect(() => {
            [...i];
        }).to.throw('ops!');
    });
    it('must retry the number of attempts', () => {
        let count = 0;
        const i = pipe(
            [1, 2, 3, 4, 5],
            tap(() => {
                if (count++ < 3) {
                    throw 'ops!'; // throw only once
                }
            }),
            retry(3)
        );
        expect([...i]).to.eql([4, 5]);
    });
    it('must retry on callback result', () => {
        const indexes: number[] = [],
            attempts: number[] = [];
        const i = pipe(
            [11, 20, 33, 40, 55, 60, 77, 80, 99],
            tap((value) => {
                if (value % 2 === 0) {
                    throw new Error(`fail-${value}`); // throw for all even numbers
                }
            }),
            retry((idx, att) => {
                indexes.push(idx);
                attempts.push(att);
                return att < 1; // retry once
            })
        );
        expect([...i]).to.eql([11, 33, 55, 77, 99]);
        expect(indexes).to.eql([1, 3, 5, 7]);
        expect(attempts).to.eql([0, 0, 0, 0]);
    });
};
