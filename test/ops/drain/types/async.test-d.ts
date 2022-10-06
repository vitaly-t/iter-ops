import {expectType} from 'tsd';

import {AsyncIterableExt, drain, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipeAsync(iterableString, drain());
expectType<AsyncIterableExt<string>>(test1);
