import {expectType} from 'tsd';

import {pipe, catchError, IterableExt} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipe(
    iterableString,
    catchError((err, ctx) => {})
);
expectType<IterableExt<string>>(test1);
