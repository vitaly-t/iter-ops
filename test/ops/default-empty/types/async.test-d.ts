import {expectType} from 'tsd';

import {AsyncIterableExt, defaultEmpty, pipe} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipe(iterableString, defaultEmpty(123));
expectType<AsyncIterableExt<string | number>>(test1);
