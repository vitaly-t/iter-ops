import {zip, pipeSync} from '../../../../src';

declare const iterableNumber: Iterable<number>;
declare const iterableString: Iterable<string>;

// $ExpectType IterableExt<[number, string]>
pipeSync(iterableNumber, zip(iterableString));
