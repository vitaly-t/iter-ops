import {expectType} from 'tsd';

import {flat, IterableExt, pipe} from '../../../../src';

declare const iterableNumber: Iterable<Iterable<number>>;

const test1 = pipe(iterableNumber, flat());
expectType<IterableExt<number>>(test1);
