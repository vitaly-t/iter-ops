import {expectType} from 'tsd';

import {flat, IterableExt, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<Iterable<number>>;

const test1 = pipeSync(iterableNumber, flat());
expectType<IterableExt<number>>(test1);
