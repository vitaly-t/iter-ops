import {take, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<number>
pipeSync(iterableNumber, take(5));
