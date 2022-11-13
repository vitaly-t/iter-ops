import {UnknownIterable, filter, map, pipe, toArray} from '../../../dist';

export async function testIterOps(input: UnknownIterable<number>) {
    const start = Date.now();
    const i = pipe(
        input,
        filter((a) => a % 2 === 0),
        map((b) => ({value: b})),
        toArray()
    );
    const {length} = (await i.first)!;
    const duration = Date.now() - start;
    return {'iter-ops': {duration, length: length}};
}
