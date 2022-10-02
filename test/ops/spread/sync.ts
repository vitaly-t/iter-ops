import {expect} from '../../header';
import {pipeSync, spread} from '../../../src';

export default () => {
    it('must split strings', () => {
        const output = pipeSync(['one', 'two'], spread());
        expect([...output]).to.eql(['o', 'n', 'e', 't', 'w', 'o']);
    });
    it('must split arrays', () => {
        const output = pipeSync(
            [
                [1, 2],
                [3, 4],
            ],
            spread()
        );
        expect([...output]).to.eql([1, 2, 3, 4]);
    });
    it('must handle empty iterables', () => {
        const output1 = pipeSync([], spread());
        const output2 = pipeSync([[]], spread());
        const output3 = pipeSync([[], []], spread());
        const output4 = pipeSync([''], spread());
        expect([...output1]).to.eql([]);
        expect([...output2]).to.eql([]);
        expect([...output3]).to.eql([]);
        expect([...output4]).to.eql([]);
    });
    it('must find values after empty', () => {
        const output = pipeSync([[], [1]], spread());
        expect([...output]).to.eql([1]);
    });
    it('must throw on non-iterable', () => {
        expect(() => {
            const i = pipeSync(['text', 123 as any], spread());
            [...i];
        }).to.throw('Value at index 1 is not iterable: 123');
    });
};
