import {expectType} from 'tsd';

import {AsyncIterableExt, defaultEmpty, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipeAsync(iterableString, defaultEmpty(123));
expectType<AsyncIterableExt<string | number>>(test1);
