import {expectType} from 'tsd';

import {flatMap, IterableExt, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<Iterable<number>>;
declare const iterableEntries: IterableIterator<[string, number]>;

const test1 = pipeSync(
    iterableNumber,
    flatMap((value) => {
        expectType<Iterable<number>>(value);
        return 123;
    })
);
expectType<IterableExt<number>>(test1);

const test2 = pipeSync(
    iterableNumber,
    flatMap((value) => {
        expectType<Iterable<number>>(value);
        return [1, 2, 3];
    })
);
expectType<IterableExt<number>>(test2);

const test3 = pipeSync(
    iterableEntries,
    flatMap(([key, value]) => {
        expectType<string>(key);
        expectType<number>(value);
        return [1, 2, 3];
    })
);
expectType<IterableExt<number>>(test3);
