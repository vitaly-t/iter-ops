import {defaultEmpty, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;

// $ExpectType IterableExt<string | number>
pipeSync(iterableString, defaultEmpty(123));
