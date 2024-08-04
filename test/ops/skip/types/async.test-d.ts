import {expectType} from 'tsd';

import {skip, pipe, type AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, skip(2));
expectType<AsyncIterableExt<number>>(test1);
