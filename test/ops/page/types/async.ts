import {page, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<number[]>
pipeAsync(iterableNumber, page(5));
