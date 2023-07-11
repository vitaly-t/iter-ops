import {isIteratorResult} from '../../src/typeguards';
import {expect} from '../header';

export default () => {
    it('must work typical results', () => {
        expect(isIteratorResult({value: 1, done: false})).to.equal(true);
    });
    it('must work for undefined value', () => {
        expect(isIteratorResult({value: undefined, done: false})).to.equal(
            true,
        );
    });
    it('must work when missing done', () => {
        expect(isIteratorResult({value: undefined})).to.equal(true);
    });
    it('must work for done results', () => {
        expect(isIteratorResult({value: undefined, done: true})).to.equal(true);
    });
    it('must work for done results, without value', () => {
        expect(isIteratorResult({done: true})).to.equal(true);
    });

    it('must work for non-iterator results', () => {
        expect(isIteratorResult({foo: 1})).to.equal(false);
    });
};
