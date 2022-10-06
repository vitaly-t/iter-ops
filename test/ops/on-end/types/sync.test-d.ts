import {expectType} from 'tsd';

import {IterableExt, onEnd, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;

const test1 = pipeSync(
    iterableString,
    onEnd(() => {})
);
expectType<IterableExt<string>>(test1);
