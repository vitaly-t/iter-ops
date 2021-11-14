import {expect} from './header';
import {pipe, map} from '../src';

describe('map', () => {
    it('must remap values', () => {
        const input = [1, 2, 3];
        const output = pipe(input, map(value => ({value})));
        expect([...output]).to.eql([{value: 1}, {value: 2}, {value: 3}]);
    });
});
