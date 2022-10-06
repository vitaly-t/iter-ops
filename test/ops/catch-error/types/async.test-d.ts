import {expectType} from 'tsd';

import {pipeAsync, catchError, AsyncIterableExt} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipeAsync(
    iterableString,
    catchError((err, ctx) => {})
);
expectType<AsyncIterableExt<string>>(test1);
