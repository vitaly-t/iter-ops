import {expectType} from 'tsd';

import {IterableExt, pipe, consume} from '../../../../src';

declare const iterableNumber: Iterable<number>;

const test = pipe(
    iterableNumber,
    consume(() => 'hello')
);
expectType<IterableExt<string>>(test);
