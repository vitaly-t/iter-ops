import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {timeout, pipe} from '../../../../src/entry/sync';

declare const iterableNumber: Iterable<string>;

const test1 = pipe(iterableNumber, timeout(10));
expectType<IterableExt<string>>(test1);
