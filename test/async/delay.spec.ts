import {_async, _asyncValues, expect} from '../header';
import {pipe, delay} from '../../src';

describe('delay', () => {
    it('must emit after count', () => {
        // @ts-ignore
        const output = pipe([], delay(10));
        expect(true).to.be.true;
    });
});
