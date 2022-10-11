import {expectType} from 'tsd';

import {distinct, IterableExt, pipe} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipe(iterableString, distinct());
expectType<IterableExt<string>>(test1);
