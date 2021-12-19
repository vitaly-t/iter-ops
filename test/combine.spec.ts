import {_async, _asyncValues, expect} from './header';
import {pipe, combine} from '../src';

function createIterator() {
    let value = false, index = 0;
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

describe('sync combine', () => {
    it('must combine all values', () => {
        const i = pipe([1, 2, 3], combine('here!', createIterator()));
        expect([...i]).to.eql([[1, 'h', true], [2, 'e', false], [3, 'r', true], [3, 'e', false], [3, '!', false]]);
    });
    it('must allow non-starters', () => {
        const i = pipe([1, 2, 3], combine([]));
        expect([...i]).to.eql([]);
    });
    it('must not retry once finished', () => {
        const i = pipe([1, 2, 3], combine('here'))[Symbol.iterator]();
        i.next() && i.next() && i.next() && i.next() && i.next(); // iteration over here
        expect(i.next()).to.eql({value: undefined, done: true});
    });
    it('must work without arguments', () => {
        const i = pipe([1, 2, 3], combine());
        expect([...i]).to.eql([[1], [2], [3]]);
    });
});

describe('async combine', () => {
    it('must combine all sync values', async () => {
        const i = pipe(_async([1, 2, 3]), combine('here!', createIterator()));
        expect(await _asyncValues(i)).to.eql([[1, 'h', true], [2, 'e', false], [3, 'r', true], [3, 'e', false], [3, '!', false]]);
    });
    it('must combine all async values', async () => {
        const i = pipe(_async([1, 2, 3]), combine(_async('here!'), _async(createIterator())));
        expect(await _asyncValues(i)).to.eql([[1, 'h', true], [2, 'e', false], [3, 'r', true], [3, 'e', false], [3, '!', false]]);
    });
    it('must allow non-starters', async () => {
        const i = pipe(_async([1, 2, 3]), combine([]));
        expect(await _asyncValues(i)).to.eql([]);
    });
    it('must work without arguments', async () => {
        const i = pipe(_async([1, 2, 3]), combine());
        expect(await _asyncValues(i)).to.eql([[1], [2], [3]]);
    });
    it('must not retry once finished', async () => {
        const i = pipe(_async([1, 2, 3]), combine('here'))[Symbol.asyncIterator]();
        for (let k = 0; k < 5; k++) {
            await i.next();
        }
        expect(await i.next()).to.eql({value: undefined, done: true});
    });
    /*
    // TODO: Doesn't work, just hangs (test only)
    it('must handle complex race scenarios', async () => {
        const p1 = _async([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const p2 = async function* evenNumbers(maxEven: number): AsyncIterableIterator<number> {
            for (let i = 2; i <= maxEven; i += 2) {
                yield new Promise<number>(resolve => {
                    setTimeout(() => resolve(i), 10);
                });
            }
        };
        const p3 = async function* oddNumbers(maxOdd: number): AsyncIterableIterator<number> {
            for (let i = 1; i <= maxOdd; i += 2) {
                yield new Promise<number>(resolve => {
                    setTimeout(() => resolve(i), 5);
                });
            }
        };
        const i = pipe(p1, combine(p2(12), p3(9)));
        expect(await _asyncValues(i)).to.eql([]);
    }).timeout(5_000);
    */
    describe('with errors', () => {
        it('must handle sync start errors', async () => {
            let err: any;
            const problem: AsyncIterator<any> = {
                next() {
                    return Promise.reject('ops');
                }
            };
            const i = pipe(_async([1, 2, 3]), combine(problem));
            try {
                await _asyncValues(i);
            } catch (e) {
                err = e;
            }
            expect(err).to.eql('ops');
        });
        it('must handle sync after-start errors', async () => {
            let err: any, emitted: boolean;
            const problem: AsyncIterator<any> = {
                async next() {
                    if (!emitted) {
                        emitted = true;
                        return {value: 'hi', done: false};
                    }
                    return Promise.reject('ops');
                }
            };
            const i = pipe(_async([1, 2, 3]), combine(problem));
            try {
                await _asyncValues(i);
            } catch (e) {
                err = e;
            }
            expect(err).to.eql('ops');
        });

    });
});
