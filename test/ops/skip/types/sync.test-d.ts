import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {skip, pipe} from '../../../../src/entry/sync';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, skip(2));
expectType<IterableExt<number>>(test1);
