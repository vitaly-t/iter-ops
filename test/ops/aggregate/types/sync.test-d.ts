import {expectType} from 'tsd';

import {pipeSync, aggregate, IterableExt} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipeSync(
    iterableString,
    aggregate((v) => 1)
);
expectType<IterableExt<number>>(test1);

const test2 = pipeSync(
    iterableString,
    aggregate((v) => v.join())
);
expectType<IterableExt<string>>(test2);
