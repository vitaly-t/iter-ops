import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {pipe, catchError} from '../../../../src/entry/async';

declare const iterableString: AsyncIterable<string>;

const test1 = pipe(
    iterableString,
    catchError((err, ctx) => {})
);
expectType<AsyncIterableExt<string>>(test1);
