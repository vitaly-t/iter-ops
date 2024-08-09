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
        const ind: number[] = [],
            att: number[] = [];
        const i = pipe(
            [11, 20, 33, 40, 55, 60, 77, 80, 99],
            tap((value) => {
                if (value % 2 === 0) {
                    throw new Error(`fail-${value}`); // throw for all even numbers
                }
            }),
            retry(({attempt, index}) => {
                att.push(attempt);
                ind.push(index);
                return attempt < 1; // retry once
            })
        );
        expect([...i]).to.eql([11, 33, 55, 77, 99]);
        expect(ind).to.eql([1, 3, 5, 7]);
        expect(att).to.eql([0, 0, 0, 0]);
    });
};
