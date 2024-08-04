import {expectType} from 'tsd';

import {type AsyncIterableExt, drain, pipe} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipe(iterableString, drain());
expectType<AsyncIterableExt<string>>(test1);
