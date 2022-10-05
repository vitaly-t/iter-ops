import {flat, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<Iterable<number>>;

// $ExpectType IterableExt<number>
pipeSync(iterableNumber, flat());
