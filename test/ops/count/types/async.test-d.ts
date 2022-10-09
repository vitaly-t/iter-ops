import {expectType} from 'tsd';
import {AsyncIterableExt, count, pipe} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipe(iterableString, count());
expectType<AsyncIterableExt<number>>(test1);
