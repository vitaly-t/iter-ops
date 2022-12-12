import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {repeat, pipe} from '../../../../src/entry/sync';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, repeat(2));
expectType<IterableExt<number>>(test1);
