import {expectType} from 'tsd';

import {reduce, pipe, AsyncIterableExt, IterationState} from '../../../../src';

declare const iterableNumber: AsyncIterable<string>;

const test1 = pipe(
    iterableNumber,
    reduce((c, v, i, s) => {
        expectType<string>(c);
        expectType<string>(v);
        expectType<number>(i);
        expectType<IterationState>(s);
        return 'foo';
    })
);
expectType<AsyncIterableExt<string>>(test1);

const test2 = pipe(
    iterableNumber,
    reduce((c, v, i, s) => {
        expectType<string>(c);
        expectType<string>(v);
        expectType<number>(i);
        expectType<IterationState>(s);
        return 'foo';
    }, 'bar')
);
expectType<AsyncIterableExt<string>>(test2);

const test3 = pipe(
    iterableNumber,
    reduce((c, v, i, s) => {
        expectType<string>(c);
        expectType<string>(v);
        expectType<number>(i);
        expectType<IterationState>(s);
        return Promise.resolve('foo');
    })
);
expectType<AsyncIterableExt<string>>(test3);

const test4 = pipe(
    iterableNumber,
    reduce((c, v, i, s) => {
        expectType<string>(c);
        expectType<string>(v);
        expectType<number>(i);
        expectType<IterationState>(s);
        return Promise.resolve('foo');
    }, 'bar')
);
expectType<AsyncIterableExt<string>>(test4);
