import {expectType} from 'tsd';

import {IterableExt, page, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(iterableNumber, page(5));
expectType<IterableExt<number[]>>(test1);
