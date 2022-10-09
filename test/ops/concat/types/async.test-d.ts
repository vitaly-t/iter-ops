import {expectType} from 'tsd';

import {AsyncIterableExt, concat, pipe} from '../../../../src';

declare const iterableString: AsyncIterable<string>;
declare const iterableNumber: AsyncIterable<number>;

const test1 = pipe(iterableString, concat(iterableNumber));
expectType<AsyncIterableExt<string | number>>(test1);
