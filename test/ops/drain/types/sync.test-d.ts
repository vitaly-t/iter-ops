import {expectType} from 'tsd';

import {drain, type IterableExt, pipe} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipe(iterableString, drain());
expectType<IterableExt<string>>(test1);
