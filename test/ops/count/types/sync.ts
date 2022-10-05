import {count, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;

// $ExpectType IterableExt<number>
pipeSync(iterableString, count());
