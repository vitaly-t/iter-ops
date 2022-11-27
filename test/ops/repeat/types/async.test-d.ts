import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {repeat, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, repeat(2));
expectType<AsyncIterableExt<number>>(test1);
