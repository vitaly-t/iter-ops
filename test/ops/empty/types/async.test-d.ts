import {expectType} from 'tsd';

import {AsyncIterableExt, empty, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipeAsync(iterableString, empty());
expectType<AsyncIterableExt<string>>(test1);
