import {expectType} from 'tsd';

import {AsyncIterableExt, distinct, pipe} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipe(iterableString, distinct());
expectType<AsyncIterableExt<string>>(test1);
