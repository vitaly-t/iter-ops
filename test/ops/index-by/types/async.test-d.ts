import {expectType} from 'tsd';

import {
    AsyncIterableExt,
    IIndexedValue,
    indexBy,
    pipeAsync,
} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipeAsync(
    iterableString,
    indexBy(() => true)
);
expectType<AsyncIterableExt<IIndexedValue<string>>>(test1);
