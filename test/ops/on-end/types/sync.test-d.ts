import {expectType} from 'tsd';

import {IterableExt, onEnd, pipe} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipe(
    iterableString,
    onEnd(() => {})
);
expectType<IterableExt<string>>(test1);
