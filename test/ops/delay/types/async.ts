import {delay, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

// $ExpectType AsyncIterableExt<string>
pipeAsync(iterableString, delay(123));