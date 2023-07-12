import {expectType} from 'tsd';

import {AsyncIterableExt, onEnd, pipe} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipe(
    iterableString,
    onEnd(() => {})
);
expectType<AsyncIterableExt<string>>(test1);
