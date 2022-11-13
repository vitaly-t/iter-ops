import {expectType} from 'tsd';

import {timeout, pipe, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<string>;

const test1 = pipe(iterableNumber, timeout(10));
expectType<IterableExt<string>>(test1);
