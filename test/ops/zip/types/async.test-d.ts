import {expectType} from 'tsd';

import {zip, pipe, AsyncIterableExt} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;
declare const iterableString: Iterable<string>;

const test1 = pipe(iterableNumber, zip(iterableString));
expectType<AsyncIterableExt<[number, string]>>(test1);
