import {expectType} from 'tsd';

import {AsyncIterableExt, distinct, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipeAsync(iterableString, distinct());
expectType<AsyncIterableExt<string>>(test1);
