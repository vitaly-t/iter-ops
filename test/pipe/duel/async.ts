import {_asyncValues, expect} from '../../header';
import {pipeAsync} from '../../../src';

export default () => {
    describe('without operators', () => {
        it('must work for iterable objects', async () => {
            const input = [10, 20, 30];
            const output = pipeAsync(input);
            expect(await _asyncValues(output)).to.eql(input);
            expect(await output.first).to.eql(10);
        });
        it('must work for strings', async () => {
            const output = pipeAsync('one');
            expect(await _asyncValues(output)).to.eql(['o', 'n', 'e']);
            expect(await output.first).to.eql('o');
        });
    });
    describe('catch', () => {
        it('must allow full nesting', async () => {
            const dummy = () => {
                return 2;
            };
            const a = pipeAsync([1]);
            expect(typeof a.catch).to.eql('function');
            expect(typeof a.catch(dummy).catch).to.eql('function');
            expect(typeof a.catch(dummy).catch(dummy).catch).to.eql('function');
            expect(await a.first).to.eql(1);
            expect(await a.catch(dummy).first).to.eql(1);
            expect(await a.catch(dummy).catch(dummy).first).to.eql(1);
        });
    });
    describe('with invalid inputs', () => {
        it('must throw an error', () => {
            expect(() => {
                pipeAsync(123 as any);
            }).to.throw();
        });
    });
};
