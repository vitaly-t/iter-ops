import {pipeSync, aggregate} from '../../../../src';

declare const iterableString: Iterable<string>;

// $ExpectType IterableExt<number>
pipeSync(
    iterableString,
    aggregate((v) => 1)
);

// $ExpectType IterableExt<string>
pipeSync(
    iterableString,
    aggregate((v) => v.join())
);
