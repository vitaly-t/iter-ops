import {expect} from './header';
import {pipe, tap} from '../src';

describe('tap', () => {
    it('must be called for all values', () => {
        const input = [1, 2, 3], res: any[] = [];
        const a = pipe(input, tap((val, idx) => {
            res.push({val, idx});
        }));
        // @ts-ignore
        const trigger = [...a];
        expect(res).to.eql([{val: 1, idx: 0}, {val: 2, idx: 1}, {val: 3, idx: 2}]);
    });
});
