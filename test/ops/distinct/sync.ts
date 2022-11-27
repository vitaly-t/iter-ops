import {expect} from '../../header';
import {pipe, distinct} from '../../../src/entry/sync';

export default () => {
    const objects = [{a: 1}, {a: 1}, {a: 2}, {a: 2}, {a: 2}, {a: 3}];
    describe('without selector', () => {
        it('must emit unique values', () => {
            const input = [1, 1, 2, 2, 2, 3];
            const output = pipe(input, distinct());
            expect([...output]).to.eql([1, 2, 3]);
        });
        it('must emit repeated objects', () => {
            // this test shows that any new object is treated as unique by default,
            // and therefore default unique selection for objects is not possible;
            const output = pipe(objects, distinct());
            expect([...output]).to.deep.equal(objects);
        });
    });
    describe('with selector', () => {
        it('must emit unique values based on selector', () => {
            const indexes: any[] = [];
            const output = pipe(
                objects,
                distinct((sel, idx) => {
                    indexes.push(idx);
                    return sel.a;
                })
            );
            expect([...output]).to.eql([{a: 1}, {a: 2}, {a: 3}]);
            expect(indexes).to.eql([0, 1, 2, 3, 4, 5]); // index is for each original element
        });
        it('must ignore invalid selectors', () => {
            const output = pipe([1, 1, 2, 2], distinct('bla' as any));
            expect([...output]).to.eql([1, 2]);
        });
    });
};
