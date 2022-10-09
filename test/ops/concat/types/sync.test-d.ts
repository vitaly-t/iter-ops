import {expectType} from 'tsd';

import {concat, IterableExt, pipe} from '../../../../src';

declare const iterableString: Iterable<string>;
declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableString, concat(iterableNumber));
expectType<IterableExt<string | number>>(test1);
