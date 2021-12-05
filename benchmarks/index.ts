import * as it from '../dist';
import * as rx from 'rxjs';

// tslint:disable:no-console

async function testRXJS(input: number[], withSubscription?: boolean) {
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

function testIterOps(input: number[]) {
    const start = Date.now();
    const i = it.pipe(
        input,
        it.filter(a => a % 2 === 0),
        it.map(b => ({value: b})),
        it.toArray()
    );
    const {length} = i.first!;
    const duration = Date.now() - start;
    return {'iter-ops': {duration, length}};
}

(async function test() {
    const input: number[] = [];
    for (let i = 0; i < 1e7; i++) {
        input.push(i);
    }
    const result = {
        ...testIterOps(input),
        ...await testRXJS(input),
        ...await testRXJS(input, true)
    };
    console.table(result);
})();
