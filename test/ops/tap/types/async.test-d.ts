import {expectType} from 'tsd';

import {tap, pipe, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(
    iterableNumber,
    tap(() => {}),
);
expectType<AsyncIterableExt<number>>(test1);
