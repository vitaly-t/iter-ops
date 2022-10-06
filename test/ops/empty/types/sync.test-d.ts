import {expectType} from 'tsd';

import {empty, IterableExt, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipeSync(iterableString, empty());
expectType<IterableExt<string>>(test1);
