import {expectType} from 'tsd';

import {
    type AsyncIterableExt,
    type IIndexedValue,
    indexBy,
    pipe
} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipe(
    iterableString,
    indexBy(() => true)
);
expectType<AsyncIterableExt<IIndexedValue<string>>>(test1);
