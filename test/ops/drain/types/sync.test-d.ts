import {expectType} from 'tsd';

import {drain, IterableExt, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipeSync(iterableString, drain());
expectType<IterableExt<string>>(test1);
