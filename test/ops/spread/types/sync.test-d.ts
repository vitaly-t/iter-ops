import {expectType} from 'tsd';

import {spread, pipe, type IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<Iterable<number>>;

const test1 = pipe(iterableNumber, spread());
expectType<IterableExt<number>>(test1);
