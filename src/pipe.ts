import type {
    AsyncIterableExt,
    IterableExt,
    OperationAsync,
    OperationSync,
} from './types';
import {$A, $S} from './types';
import {catchError} from './ops/catch-error';
import {optimizeIterable} from './utils';
import type {PipeSync, PipeAsync} from './types/pipe-overloads';

export const pipe = (<T>(i: Iterable<T>, ...p: OperationSync<any, any>[]) => {
    const iter = (p as OperationSync<unknown, unknown>[]).reduce<
        Iterable<unknown>
    >((c, a) => a(c), optimizeIterable(i));

    return extendIterable(iter);
}) as PipeSync;

export const pipeAsync = (<T>(
    i: AsyncIterable<T>,
    ...p: OperationAsync<any, any>[]
) => {
    const iter = (p as OperationAsync<unknown, unknown>[]).reduce<
        AsyncIterable<unknown>
    >((c, a) => a(c), i);

    return extendAsyncIterable(iter);
}) as PipeAsync;

/**
 * Extends an Iterable object into IterableExt type.
 *
 * Note: this mutables the given iterable.
 */
function extendIterable<T>(i: any): IterableExt<T> {
    Object.defineProperty(i, 'first', {get: () => i[$S]().next().value});
    i.catch = (cb: any) => extendIterable(catchError(cb)(i));
    return i;
}

/**
 * Extends an AsyncIterable object into AsyncIterableExt type.
 *
 * Note: this mutables the given iterable.
 */
function extendAsyncIterable<T>(i: any): AsyncIterableExt<T> {
    Object.defineProperty(i, 'first', {
        get: () =>
            i[$A]()
                .next()
                .then((a: any) => a.value),
    });
    i.catch = (cb: any) => extendAsyncIterable(catchError(cb)(i));
    return i;
}
