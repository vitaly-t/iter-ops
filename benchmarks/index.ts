import * as it from '../dist';
import * as rx from 'rxjs';

// tslint:disable:no-console

const maxItems = 1e7;

type InputType = Iterable<number> | AsyncIterable<number>;

async function testRXJS(input: InputType, withSubscription?: boolean) {
    const start = Date.now();
    const i = rx.from(input).pipe(
        rx.filter(a => a % 2 === 0),
        rx.map(b => ({value: b})),
        rx.toArray()
    );
    if (withSubscription) {
        // key to measuring RXJS correctly;
        i.subscribe();
    }
    const {length} = await rx.firstValueFrom(i);
    const duration = Date.now() - start;
    if (withSubscription) {
        return {'rxjs + sub': {duration, length}};
    }
    return {'rxjs': {duration, length}};
}

async function testIterOps(input: InputType) {
    const start = Date.now();
    const i = it.pipe(
        input,
        it.filter(a => a % 2 === 0),
        it.map(b => ({value: b})),
        it.toArray()
    );
    const {length} = (await i.first)!;
    const duration = Date.now() - start;
    return {'iter-ops': {duration, length}};
}

(async function testSync() {
    const input: number[] = [];
    for (let i = 0; i < maxItems; i++) {
        input.push(i);
    }
    const result = {
        ...await testIterOps(input),
        ...await testRXJS(input),
        ...await testRXJS(input, true)
    };
    console.table(result);
})();

(async function testAsync() {
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
    const result = {
        ...await testIterOps(input),
        ...await testRXJS(input),
        ...await testRXJS(input, true)
    };
    console.table(result);
})();
