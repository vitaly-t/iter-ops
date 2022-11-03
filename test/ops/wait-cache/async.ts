import {_async, _asyncValues, expect} from '../../header';
import {pipe, map, waitCache} from '../../../src';

export default () => {
    it('must resolve all promises', async () => {
        const i = pipe(
            _async([1, 2, 3, 4]),
            map((a) => Promise.resolve(a)),
            waitCache(2)
        );
        expect(await _asyncValues(i)).to.have.members([1, 2, 3, 4]);
    });
    it('must resolve all simple values', async () => {
        const i = pipe(
            _async([1, 2, 3, 4]),
            waitCache(2)
        );
        expect(await _asyncValues(i)).to.have.members([1, 2, 3, 4]);
    });
    it('must resolve combinations of promises and simple values', async () => {
        const i = pipe(_async([1, Promise.resolve(2), 3, Promise.resolve(4)]), waitCache(2));
        expect(await _asyncValues(i)).to.have.members([1, 2, 3, 4]);
    });
};
