import {expect} from '../../header';
import {pipeSync, aggregate} from '../../../src';

export default () => {
    it('must process data correctly', () => {
        const output = pipeSync(
            [1, 2, 3],
            aggregate((arr) => {
                return arr.reduce((a, c) => a + c);
            })
        );
        expect([...output]).to.eql([6]);
    });
    it('must handle empty iterables', () => {
        const output = pipeSync(
            [],
            aggregate((arr) => {
                return arr;
            })
        );
        expect([...output]).to.eql([[]]);
    });
    it('must allow return of nothing', () => {
        const output = pipeSync(
            [],
            aggregate(() => {})
        );
        expect([...output]).to.eql([undefined]);
    });
};
