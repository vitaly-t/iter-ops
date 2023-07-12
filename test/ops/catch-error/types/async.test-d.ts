import {expectType} from 'tsd';

import {pipe, catchError, AsyncIterableExt} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipe(
    iterableString,
    catchError((err, ctx) => {})
);
expectType<AsyncIterableExt<string>>(test1);
