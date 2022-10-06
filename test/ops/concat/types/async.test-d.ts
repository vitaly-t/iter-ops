import {expectType} from 'tsd';

import {AsyncIterableExt, concat, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;
declare const iterableNumber: AsyncIterable<number>;

const test1 = pipeAsync(iterableString, concat(iterableNumber));
expectType<AsyncIterableExt<string | number>>(test1);
