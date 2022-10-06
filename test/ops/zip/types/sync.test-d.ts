import {expectType} from 'tsd';

import {zip, pipeSync, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;
declare const iterableString: Iterable<string>;

const test1 = pipeSync(iterableNumber, zip(iterableString));
expectType<IterableExt<[number, string]>>(test1);
