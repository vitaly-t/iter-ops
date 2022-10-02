import {_asyncValues, expect} from '../../header';
import {pipeAsync, indexBy} from '../../../src';

export default () => {
    it('must work for an empty list', async () => {
        const i = pipeAsync(
            [],
            indexBy(() => true)
        );
        expect(await _asyncValues(i)).to.eql([]);
    });
    it('must work for partial match', async () => {
        const calls: any[] = [];
        const i = pipeAsync(
            [1, 2, 3, 4],
            indexBy((value, index) => {
                calls.push({value, index});
                return value % 2 === 0;
            })
        );
        expect(await _asyncValues(i)).to.eql([
            {index: 1, value: 2},
            {index: 3, value: 4},
        ]);
        expect(calls).to.eql([
            {index: 0, value: 1},
            {index: 1, value: 2},
            {index: 2, value: 3},
            {index: 3, value: 4},
        ]);
    });
    it('must work for partial async match', async () => {
        const calls: any[] = [];
        const i = pipeAsync(
            [1, 2, 3, 4],
            indexBy(async (value, index) => {
                calls.push({value, index});
                return value % 2 === 0;
            })
        );
        expect(await _asyncValues(i)).to.eql([
            {index: 1, value: 2},
            {index: 3, value: 4},
        ]);
        expect(calls).to.eql([
            {index: 0, value: 1},
            {index: 1, value: 2},
            {index: 2, value: 3},
            {index: 3, value: 4},
        ]);
    });
    it('must work for no-match', async () => {
        const i = pipeAsync(
            [1, 2, 3],
            indexBy(() => false)
        );
        expect(await _asyncValues(i)).to.eql([]);
    });
    it('must work for async no-match', async () => {
        const i = pipeAsync(
            [1, 2, 3],
            indexBy(async () => false)
        );
        expect(await _asyncValues(i)).to.eql([]);
    });
};
