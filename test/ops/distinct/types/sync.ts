import {distinct, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;

// $ExpectType IterableExt<string>
pipeSync(iterableString, distinct());
