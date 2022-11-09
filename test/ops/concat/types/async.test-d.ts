import {expectType} from 'tsd';

import {AsyncIterableExt, concat, pipe} from '../../../../src';

declare const iterableString: AsyncIterable<string>;
declare const iterableNumber: AsyncIterable<number>;

declare const iteratorNumber: AsyncIterator<number>;

const test1 = pipe(iterableString, concat(iterableNumber));
expectType<AsyncIterableExt<string | number>>(test1);

const test2 = pipe(iterableString, concat(iteratorNumber));
expectType<AsyncIterableExt<string | number>>(test2);
