import {expect} from './header';
import {pipe, stop} from '../src';

describe('stop', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    expect([...pipe(input, stop(a => a > 5))]).to.eql([1, 2, 3, 4, 5]);
});
