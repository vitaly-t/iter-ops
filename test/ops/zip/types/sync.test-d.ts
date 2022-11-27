import {expectType} from 'tsd';

import type {IterableExt} from '../../../../src';
import {zip, pipe} from '../../../../src/entry/sync';

declare const iterableNumber: Iterable<number>;
declare const iterableString: Iterable<string>;

const test1 = pipe(iterableNumber, zip(iterableString));
expectType<IterableExt<[number, string]>>(test1);
