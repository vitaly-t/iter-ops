import {expectType} from 'tsd';

import {type AsyncIterableExt, delay, pipe} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipe(iterableString, delay(123));
expectType<AsyncIterableExt<string>>(test1);
