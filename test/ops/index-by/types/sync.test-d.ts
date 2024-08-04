import {expectType} from 'tsd';

import {
    type IIndexedValue,
    indexBy,
    type IterableExt,
    pipe
} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipe(
    iterableString,
    indexBy(() => true)
);
expectType<IterableExt<IIndexedValue<string>>>(test1);
