import {_async, _asyncValues, expect} from './header';
import {pipe, indexBy} from '../src';

describe('sync indexBy', () => {
    it('must work for an empty list', () => {
        const i = pipe([], indexBy(() => true));
        expect([...i]).to.eql([]);
    });
    it('must work for partial match', () => {
        const calls: any[] = [];
        const i = pipe([1, 2, 3, 4], indexBy((value, index) => {
            calls.push({value, index});
            return value % 2 === 0;
        }));
        expect([...i]).to.eql([{index: 1, value: 2}, {index: 3, value: 4}]);
        expect(calls).to.eql([
            {index: 0, value: 1},
            {index: 1, value: 2},
            {index: 2, value: 3},
            {index: 3, value: 4}
        ]);
    });
    it('must work for no-match', () => {
        const i = pipe([1, 2, 3], indexBy(() => false));
        expect([...i]).to.eql([]);
    });
});

describe('async indexBy', () => {
    it('must work for an empty list', async () => {
        const i = pipe(_async([]), indexBy(() => true));
        expect(await _asyncValues(i)).to.eql([]);
    });
    it('must work for partial match', async () => {
        const calls: any[] = [];
        const i = pipe(_async([1, 2, 3, 4]), indexBy((value, index) => {
            calls.push({value, index});
            return value % 2 === 0;
        }));
        expect(await _asyncValues(i)).to.eql([{index: 1, value: 2}, {index: 3, value: 4}]);
        expect(calls).to.eql([
            {index: 0, value: 1},
            {index: 1, value: 2},
            {index: 2, value: 3},
            {index: 3, value: 4}
        ]);
    });
    it('must work for no-match', async () => {
        const i = pipe(_async([1, 2, 3]), indexBy(() => false));
        expect(await _asyncValues(i)).to.eql([]);
    });
});
