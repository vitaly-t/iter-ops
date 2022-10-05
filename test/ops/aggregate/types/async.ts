import {pipeAsync, aggregate} from '../../../../src';

declare const iterableString: Iterable<string>;

// $ExpectType AsyncIterableExt<number>
pipeAsync(
    iterableString,
    aggregate((v) => 1)
);

// $ExpectType AsyncIterableExt<string>
pipeAsync(
    iterableString,
    aggregate((v) => v.join())
);
