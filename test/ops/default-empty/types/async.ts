import {defaultEmpty, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

// $ExpectType AsyncIterableExt<string | number>
pipeAsync(iterableString, defaultEmpty(123));
