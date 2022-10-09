import {expectType} from 'tsd';

import {empty, IterableExt, pipe} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipe(iterableString, empty());
expectType<IterableExt<string>>(test1);
