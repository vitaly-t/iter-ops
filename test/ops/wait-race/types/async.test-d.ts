import {expectType} from 'tsd';

import {waitRace, pipe, type AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<Promise<number>>;

const test1 = pipe(iterableNumber, waitRace(2));
expectType<AsyncIterableExt<number>>(test1);
