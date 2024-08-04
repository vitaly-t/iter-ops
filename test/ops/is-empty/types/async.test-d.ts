import {expectType} from 'tsd';

import {type AsyncIterableExt, isEmpty, pipe} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableNumber, isEmpty());
expectType<AsyncIterableExt<boolean>>(test1);
