import {expectType} from 'tsd';

import {IIndexedValue, indexBy, IterableExt, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipeSync(
    iterableString,
    indexBy(() => true)
);
expectType<IterableExt<IIndexedValue<string>>>(test1);
