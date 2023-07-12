import {_async, _asyncValues, expect} from '../../header';
import {pipe, zip} from '../../../src';
import {createIterator} from './header';

export default () => {
    it('must compress till first end', async () => {
        const i = pipe(
            _async([1, 2, 3]),
            zip('here', [11, 22, 33, 44], createIterator())
        );
        expect(await _asyncValues(i)).to.eql([
            [1, 'h', 11, true],
            [2, 'e', 22, false],
            [3, 'r', 33, true]
        ]);
    });
    it('must compress async iterables', async () => {
        const i = pipe(
            _async([1, 2, 3]),
            zip('here', _async([11, 22, 33, 44]), createIterator())
        );
        expect(await _asyncValues(i)).to.eql([
            [1, 'h', 11, true],
            [2, 'e', 22, false],
            [3, 'r', 33, true]
        ]);
    });
    it('must not retry once finished', async () => {
        const i = pipe(_async([1, 2, 3]), zip('here'))[Symbol.asyncIterator]();
        await Promise.all([i.next(), i.next(), i.next(), i.next()]); // iteration over here
        expect(await i.next()).to.eql({value: undefined, done: true});
    });
    it('must work without arguments', async () => {
        const i = pipe(_async([1, 2, 3]), zip());
        expect(await _asyncValues(i)).to.eql([[1], [2], [3]]);
    });
    it('must throw once on invalid inputs', async () => {
        const i = pipe(_async([1, 2, 3]), zip([111], [222], 333 as any));
        let err: any;
        try {
            await _asyncValues(i);
        } catch (e) {
            err = e;
        }
        expect(err.message).to.eql('Value at index 2 is not iterable: 333');
    });
};
