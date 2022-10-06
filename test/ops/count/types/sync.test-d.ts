import {expectType} from 'tsd';

import {count, IterableExt, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipeSync(iterableString, count());
expectType<IterableExt<number>>(test1);
