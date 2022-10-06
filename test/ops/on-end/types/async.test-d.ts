import {expectType} from 'tsd';

import {AsyncIterableExt, onEnd, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

const test1 = pipeAsync(
    iterableString,
    onEnd(() => {})
);
expectType<AsyncIterableExt<string>>(test1);
