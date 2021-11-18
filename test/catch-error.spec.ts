import {expect} from './header';
import {pipe, tap, catchError} from '../src';

describe('catchError', () => {
    it('must allow re-throwing', () => {
        const i = pipe(
            [1],
            tap(() => {
                throw new Error('ops');
            }),
            catchError(() => {
                throw new Error('handled');
            })
        );
        expect(() => {
            [...i];
        }).to.throw('handled');
    });
});
