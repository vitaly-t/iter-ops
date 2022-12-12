import {expectType} from 'tsd';

import type {AsyncIterableExt} from '../../../../src';
import {zip, pipe} from '../../../../src/entry/async';

declare const iterableNumber: AsyncIterable<number>;
declare const iterableString: Iterable<string>;

const test1 = pipe(iterableNumber, zip(iterableString));
expectType<AsyncIterableExt<[number, string]>>(test1);
