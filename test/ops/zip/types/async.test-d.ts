import {expectType} from 'tsd';

import {zip, pipeAsync, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;
declare const iterableString: Iterable<string>;

const test1 = pipeAsync(iterableNumber, zip(iterableString));
expectType<AsyncIterableExt<[number, string]>>(test1);
