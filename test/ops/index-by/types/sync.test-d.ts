import {expectType} from 'tsd';

import {IIndexedValue, indexBy, IterableExt, pipe} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipe(
    iterableString,
    indexBy(() => true)
);
expectType<IterableExt<IIndexedValue<string>>>(test1);
