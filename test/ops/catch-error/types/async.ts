import {pipeAsync, catchError} from '../../../../src';

declare const iterableString: Iterable<string>;

// $ExpectType AsyncIterableExt<string>
pipeAsync(
    iterableString,
    catchError((err, ctx) => {})
);
