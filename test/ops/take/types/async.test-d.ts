import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {take, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, take(5));
expectType<AsyncIterableExt<number>>(test1);
