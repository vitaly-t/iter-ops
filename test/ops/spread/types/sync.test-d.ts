import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {spread, pipe} from '../../../../src/entry/sync';

declare const iterableNumber: Iterable<Iterable<number>>;

const test1 = pipe(iterableNumber, spread());
expectType<IterableExt<number>>(test1);
