import {expectType} from 'tsd';

import {defaultEmpty, IterableExt, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipeSync(iterableString, defaultEmpty(123));
expectType<IterableExt<string | number>>(test1);
