import {UnknownIterable} from '../../../dist';
import {filter, firstValueFrom, from, map, toArray} from 'rxjs';

export async function testRXJS(
    input: UnknownIterable<number>,
    withSubscription?: boolean
) {
    const start = Date.now();
    const i = from(input).pipe(
        filter((a) => a % 2 === 0),
        map((b) => ({value: b})),
        toArray()
    );
    if (withSubscription) {
        // key to measuring RXJS correctly;
        i.subscribe();
    }
    const {length} = await firstValueFrom(i);
    const duration = Date.now() - start;
    if (withSubscription) {
        return {'rxjs + sub': {duration, length}};
    }
    return {rxjs: {duration, length}};
}
