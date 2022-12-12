import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {waitRace, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<Promise<number>>;

const test1 = pipe(iterableNumber, waitRace(2));
expectType<AsyncIterableExt<number>>(test1);
