import {expectType} from 'tsd';

import {pipe, aggregate, IterableExt} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipe(
    iterableString,
    aggregate((v) => 1),
);
expectType<IterableExt<number>>(test1);

const test2 = pipe(
    iterableString,
    aggregate((v) => v.join()),
);
expectType<IterableExt<string>>(test2);
