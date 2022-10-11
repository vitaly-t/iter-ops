import {expectType} from 'tsd';

import {AsyncIterableExt, empty, pipe} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipe(iterableString, empty());
expectType<AsyncIterableExt<string>>(test1);
