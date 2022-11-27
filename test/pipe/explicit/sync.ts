import {expect, _async} from '../../header';
import {pipe} from '../../../src/pipe/sync';

export default () => {
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
    describe('catch', () => {
        it('must allow full nesting', () => {
            const dummy = () => {
                return 2;
            };
            const a = pipe([1]);
            expect(typeof a.catch).to.eql('function');
            expect(typeof a.catch(dummy).catch).to.eql('function');
            expect(typeof a.catch(dummy).catch(dummy).catch).to.eql('function');
            expect(a.first).to.eql(1);
            expect(a.catch(dummy).first).to.eql(1);
            expect(a.catch(dummy).catch(dummy).first).to.eql(1);
        });
    });
    describe('with invalid inputs', () => {
        it('must throw an error when given a non-iterable', () => {
            expect(() => {
                pipe(123 as any);
            }).to.throw();
        });
        it('must throw an error when given an async iterable', () => {
            expect(() => {
                pipe(_async([1, 2, 3]) as any);
            }).to.throw();
        });
    });
};
