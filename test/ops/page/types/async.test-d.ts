import {expectType} from 'tsd';

import {type AsyncIterableExt, page, pipe} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, page(5));
expectType<AsyncIterableExt<number[]>>(test1);
