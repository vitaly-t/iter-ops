import {isEmpty, pipeAsync} from '../../../../src';

declare const iterableNumber: AsyncIterable<number>;

// $ExpectType AsyncIterableExt<boolean>
pipeAsync(iterableNumber, isEmpty());
