import {expectType} from 'tsd';

import {pipeSync, catchError, IterableExt} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipeSync(
    iterableString,
    catchError((err, ctx) => {})
);
expectType<IterableExt<string>>(test1);
