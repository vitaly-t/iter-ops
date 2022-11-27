import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {takeLast, pipe} from '../../../../src/entry/sync';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, takeLast(5));
expectType<IterableExt<number>>(test1);
