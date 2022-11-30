import {expectType} from 'tsd';

import {AsyncIterableExt, pipe, consume} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test = pipe(
    iterableNumber,
    consume(async () => 'hello')
);
expectType<AsyncIterableExt<string>>(test);
