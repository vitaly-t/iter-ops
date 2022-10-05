import {skip, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<number>
pipeSync(iterableNumber, skip(2));
