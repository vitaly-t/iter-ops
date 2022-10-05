import {skip, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<number>
pipeAsync(iterableNumber, skip(2));
