import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {skip, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, skip(2));
expectType<AsyncIterableExt<number>>(test1);
