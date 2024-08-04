import {expectType} from 'tsd';

import {concat, type IterableExt, pipe} from '../../../../src';

declare const iterableString: Iterable<string>;
declare const iterableNumber: Iterable<number>;

declare const iteratorString: Iterator<string>;
declare const iteratorNumber: Iterator<number>;

const test1 = pipe(iterableString, concat(iterableNumber));
expectType<IterableExt<string | number>>(test1);

const test2 = pipe([], concat(iteratorString, iteratorNumber));
expectType<IterableExt<string | number>>(test2);
