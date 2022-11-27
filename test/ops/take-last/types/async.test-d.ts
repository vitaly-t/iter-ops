import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {takeLast, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, takeLast(5));
expectType<AsyncIterableExt<number>>(test1);
