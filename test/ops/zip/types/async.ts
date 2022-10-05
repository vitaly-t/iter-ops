import {zip, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;
declare const iterableString: Iterable<string>;

// $ExpectType AsyncIterableExt<[number, string]>
pipeAsync(iterableNumber, zip(iterableString));
