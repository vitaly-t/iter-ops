import {page, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<number[]>
pipeSync(iterableNumber, page(5));
