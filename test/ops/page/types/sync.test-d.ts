import {expectType} from 'tsd';

import {type IterableExt, page, pipe} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, page(5));
expectType<IterableExt<number[]>>(test1);
