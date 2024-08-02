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
        let count = 0;
        const indexes: Array<number> = [],
            attempts: Array<number> = [];
        const i = pipe(
            [1, 2, 3, 4, 5],
            tap(() => {
                if (count++ < 3) {
                    throw 'ops!'; // throw 3 times
                }
            }),
            retry((idx, att) => {
                indexes.push(idx);
                attempts.push(att);
                return true;
            })
        );
        expect([...i]).to.eql([4, 5]);
        expect(indexes).to.eql([0, 0, 0]);
        expect(attempts).to.eql([0, 1, 2]);
    });
};
