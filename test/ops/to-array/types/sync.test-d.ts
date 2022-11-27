import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {toArray, pipe} from '../../../../src/entry/sync';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, toArray());
expectType<IterableExt<number[]>>(test1);
