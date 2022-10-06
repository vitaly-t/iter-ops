import {expectType} from 'tsd';

import {distinct, IterableExt, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipeSync(iterableString, distinct());
expectType<IterableExt<string>>(test1);
