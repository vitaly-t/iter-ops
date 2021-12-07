import * as it from '../dist';
import * as rx from 'rxjs';

type InputType = Iterable<number> | AsyncIterable<number>;

export async function testRXJS(input: InputType, withSubscription?: boolean) {
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

export async function testIterOps(input: InputType) {
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
