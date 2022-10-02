import {_asyncValues, expect} from '../../header';
import {pipeAsync, distinct} from '../../../src';

export default () => {
    const objects = [{a: 1}, {a: 1}, {a: 2}, {a: 2}, {a: 2}, {a: 3}];
    describe('without selector', () => {
        it('must emit unique values', async () => {
            const input = [1, 1, 2, 2, 2, 3];
            const output = pipeAsync(input, distinct());
            expect(await _asyncValues(output)).to.eql([1, 2, 3]);
        });
        it('must emit repeated objects', async () => {
            // this test shows that any new object is treated as unique by default,
            // and therefore default unique selection for objects is not possible;
            const output = pipeAsync(objects, distinct());
            expect(await _asyncValues(output)).to.deep.equal(objects);
        });
    });
    describe('with selector', () => {
        it('must emit unique values based on selector', async () => {
            const indexes: any[] = [];
            const output = pipeAsync(
                objects,
                distinct((sel, idx) => {
                    indexes.push(idx);
                    return sel.a;
                })
            );
            expect(await _asyncValues(output)).to.eql([{a: 1}, {a: 2}, {a: 3}]);
            expect(indexes).to.eql([0, 1, 2, 3, 4, 5]); // index is for each original element
        });
        it('must ignore invalid selectors', async () => {
            const output = pipeAsync([1, 1, 2, 2], distinct('bla' as any));
            expect(await _asyncValues(output)).to.eql([1, 2]);
        });
    });
};
