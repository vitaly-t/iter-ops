import _glob from 'glob';
import {promisify} from 'node:util';
import {execa} from 'execa';

const glob = promisify(_glob);

const testDirs = await glob('./test/**/types');
const tests = testDirs.map((dir) =>
    execa(
        'dtslint',
        ['--localTs', 'node_modules/typescript/lib', '--expectOnly', dir],
        {stdio: 'inherit'}
    )
);

const results = await Promise.allSettled(tests);
if (results.some((result) => result.status === 'rejected')) {
    process.exit(1);
}
