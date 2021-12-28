import {testIterOps} from './tests/iter-ops';
import {testRXJS} from './tests/rxjs';

// tslint:disable:no-console

const maxItems = 1e7;

const input: number[] = [];
for (let i = 0; i < maxItems; i++) {
    input.push(i);
}

(async function testSync() {
    const result = {
        ...(await testIterOps(input)),
        ...(await testRXJS(input)),
        ...(await testRXJS(input, true)),
    };
    console.log(`Synchronous test for ${maxItems.toExponential()} items:`);
    console.table(result);
})();
