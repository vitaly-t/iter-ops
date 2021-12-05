import {expect} from './header';
import {optimizeIterable} from '../src/utils';

describe('utils', () => {
    describe('optimizeIterable', () => {
        describe('for compatible types', () => {
            it('must wrap buffers', () => {
                const input = Buffer.from([1, 2, 3]);
                expect(optimizeIterable(input)).to.not.eql(input);
            });
            it('must wrap regular strings', () => {
                const input = 'test';
                expect(optimizeIterable(input)).to.not.eql(input);
            });
            it('must wrap strings - objects', () => {
                const input = new String('test');
                expect(optimizeIterable(input)).to.not.eql(input);
            });
        });
        describe('for incompatible types', () => {
            it('must return original input', () => {
                const input = 123;
                expect(optimizeIterable(input)).to.eql(input);
            });
        });
    });
});
