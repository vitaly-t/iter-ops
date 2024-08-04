import {expectType} from 'tsd';

import {empty, type IterableExt, pipe} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipe(iterableString, empty());
expectType<IterableExt<string>>(test1);
