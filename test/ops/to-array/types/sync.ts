import {toArray, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<number[]>
pipeSync(iterableNumber, toArray());
