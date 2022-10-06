import {expectType} from 'tsd';
import {AsyncIterableExt, count, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipeAsync(iterableString, count());
expectType<AsyncIterableExt<number>>(test1);
