import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {pipe, catchError} from '../../../../src/entry/sync';

declare const iterableString: Iterable<string>;

const test1 = pipe(
    iterableString,
    catchError((err, ctx) => {})
);
expectType<IterableExt<string>>(test1);
