import {expect} from '../../header';
import {pipe, aggregate} from '../../../src';

describe('sync aggregate', () => {
    it('must process data correctly', () => {
        const output = pipe(
            [1, 2, 3],
            aggregate((arr) => {
                return arr.reduce((a, c) => a + c);
            })
        );
        expect([...output]).to.eql([6]);
    });
    it('must handle empty iterables', () => {
        const output = pipe(
            [],
            aggregate((arr) => {
                return arr;
            })
        );
        expect([...output]).to.eql([[]]);
    });
    it('must allow return of nothing', () => {
        const output = pipe(
            [],
            aggregate(() => {})
        );
        expect([...output]).to.eql([undefined]);
    });
});
