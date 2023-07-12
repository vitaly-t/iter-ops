export function createIterator() {
    let value = false,
        index = 0;
    return {
        next() {
            if (index++ < 4) {
                value = !value;
                return {value, done: false};
            }
            return {value: undefined, done: true};
        }
    };
}
