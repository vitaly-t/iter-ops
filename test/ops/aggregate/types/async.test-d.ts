import {expectType} from 'tsd';

import {pipeAsync, aggregate, AsyncIterableExt} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipeAsync(
    iterableString,
    aggregate((v) => 1)
);
expectType<AsyncIterableExt<number>>(test1);

const test2 = pipeAsync(
    iterableString,
    aggregate((v) => v.join())
);
expectType<AsyncIterableExt<string>>(test2);
