import {expectType} from 'tsd';

import {spread, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<Iterable<number>>;

const test1 = pipeSync(iterableNumber, spread());
expectType<IterableExt<number>>(test1);
