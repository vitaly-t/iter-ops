import {drain, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

// $ExpectType AsyncIterableExt<string>
pipeAsync(iterableString, drain());
