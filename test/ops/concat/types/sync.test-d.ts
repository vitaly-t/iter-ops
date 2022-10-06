import {expectType} from 'tsd';

import {concat, IterableExt, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;
declare const iterableNumber: Iterable<number>;

const test1 = pipeSync(iterableString, concat(iterableNumber));
expectType<IterableExt<string | number>>(test1);
