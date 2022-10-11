import {expectType} from 'tsd';

import {isEmpty, IterableExt, pipe} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipe(iterableNumber, isEmpty());
expectType<IterableExt<boolean>>(test1);
