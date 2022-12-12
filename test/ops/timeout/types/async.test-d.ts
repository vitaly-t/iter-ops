import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {timeout, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<string>;

const test1 = pipe(iterableNumber, timeout(10));
expectType<AsyncIterableExt<string>>(test1);
