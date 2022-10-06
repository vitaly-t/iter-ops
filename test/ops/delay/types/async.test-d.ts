import {expectType} from 'tsd';

import {AsyncIterableExt, delay, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipeAsync(iterableString, delay(123));
expectType<AsyncIterableExt<string>>(test1);
