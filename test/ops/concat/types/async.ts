import {concat, pipeAsync} from '../../../../src';

declare const iterableString: AsyncIterable<string>;
declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<string | number>
pipeAsync(iterableString, concat(iterableNumber));
