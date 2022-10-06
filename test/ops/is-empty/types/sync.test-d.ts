import {expectType} from 'tsd';

import {isEmpty, IterableExt, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(iterableNumber, isEmpty());
expectType<IterableExt<boolean>>(test1);
