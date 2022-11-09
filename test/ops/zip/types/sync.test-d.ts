import {expectType} from 'tsd';

import {zip, pipe, IterableExt} from '../../../../src';

declare const iterableNumber: Iterable<number>;
declare const iterableString: Iterable<string>;

const test1 = pipe(iterableNumber, zip(iterableString));
expectType<IterableExt<[number, string]>>(test1);
