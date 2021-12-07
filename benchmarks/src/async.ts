import {testIterOps} from './tests/iter-ops';
import {testRXJS} from './tests/rxjs';

// tslint:disable:no-console

const maxItems = 1e6;
const input: AsyncIterable<number> = {
    [Symbol.asyncIterator](): AsyncIterator<number> {
        let count = maxItems;
        return {
            async next(): Promise<IteratorResult<number>> {
                if (count > 0) {
                    return {value: count--};
                }
                return {value: undefined, done: true};
            }
        };
    }
};

(async function testAsync() {
    const result = {
        ...await testIterOps(input),
        ...await testRXJS(input),
        ...await testRXJS(input, true)
    };
    console.log(`Asynchronous test for ${maxItems.toExponential()} items:`);
    console.table(result);
})();
