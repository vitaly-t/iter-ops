import {expect} from './header';
import {pipe} from '../src';

describe('pipe', () => {
    describe('without operators', () => {
        it('must work for iterable objects', () => {
            const input = [10, 20, 30];
            const output = pipe(input);
            expect([...output]).to.eql(input);
            expect(output.first).to.eql(10);
        });
        it('must work for strings', () => {
            const output = pipe('one');
            expect([...output]).to.eql(['o', 'n', 'e']);
            expect(output.first).to.eql('o');
        });
    });
});
