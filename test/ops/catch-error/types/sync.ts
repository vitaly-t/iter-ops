import {pipeSync, catchError} from '../../../../src';

declare const iterableString: Iterable<string>;

// $ExpectType IterableExt<string>
pipeSync(
    iterableString,
    catchError((err, ctx) => {})
);
