import {expectType} from 'tsd';

import {defaultEmpty, type IterableExt, pipe} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipe(iterableString, defaultEmpty(123));
expectType<IterableExt<string | number>>(test1);
