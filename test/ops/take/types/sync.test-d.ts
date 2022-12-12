import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {take, pipe} from '../../../../src/entry/sync';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, take(5));
expectType<IterableExt<number>>(test1);
