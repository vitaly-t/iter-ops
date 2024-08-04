import {expectType} from 'tsd';

import {count, type IterableExt, pipe} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipe(iterableString, count());
expectType<IterableExt<number>>(test1);
