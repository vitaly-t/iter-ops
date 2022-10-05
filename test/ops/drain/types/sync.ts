import {drain, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;

// $ExpectType IterableExt<string>
pipeSync(iterableString, drain());
