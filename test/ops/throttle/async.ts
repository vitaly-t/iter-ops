import {_async, _asyncValues, expect} from '../../header';
import {pipe, throttle} from '../../../src';

export default () => {
    it('must emit after resolved', async () => {
        const params: any[] = [];
        const output = pipe(
            _async([1, 2, 3]),
            throttle(async (value, index, state) => {
                state.sum = ((state.sum as number | undefined) || 0) + value;
                params.push({value, index, state});
                return 123;
            }),
        );
        expect(await _asyncValues(output)).to.eql([1, 2, 3]);
        expect(params).to.eql([
            {value: 1, index: 0, state: {sum: 6}},
            {value: 2, index: 1, state: {sum: 6}},
            {value: 3, index: 2, state: {sum: 6}},
        ]);
    });
    it('must throw on rejected promise', async () => {
        const i = pipe(
            _async([1]),
            throttle(() => Promise.reject(555)),
        );
        let err: any;
        try {
            await _asyncValues(i);
        } catch (e) {
            err = e;
        }
        expect(err).to.eql(555);
    });
};
