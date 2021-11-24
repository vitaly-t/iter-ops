import {expect} from './header';
import {pipe, spread} from '../src';

describe('spread', () => {
    it('must split strings', () => {
        const output = pipe(['one', 'two'], spread());
        expect([...output]).to.eql(['o', 'n', 'e', 't', 'w', 'o']);
    });
    it('must split arrays', () => {
        const output = pipe([[1, 2], [3, 4]], spread());
        expect([...output]).to.eql([1, 2, 3, 4]);
    });
});
