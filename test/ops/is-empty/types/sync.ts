import {isEmpty, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<boolean>
pipeSync(iterableNumber, isEmpty());
