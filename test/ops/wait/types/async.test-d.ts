import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {wait, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<Promise<number>>;

const test1 = pipe(iterableNumber, wait());
expectType<AsyncIterableExt<number>>(test1);
