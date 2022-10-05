import {concat, pipeSync} from '../../../../src';

declare const iterableString: Iterable<string>;
declare const iterableNumber: Iterable<number>;

// $ExpectType IterableExt<string | number>
pipeSync(iterableString, concat(iterableNumber));
