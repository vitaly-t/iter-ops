import {empty, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;

// $ExpectType AsyncIterableExt<string>
pipeAsync(iterableString, empty());
