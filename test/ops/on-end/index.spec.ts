import async from './async';
import sync from './sync';

describe('onEnd', () => {
    describe('sync', sync);
    if (!process.env.EXCLUDE_RACE_TESTS) {
        // "onEnd" racing tests are inconsistent in CI environment
        describe('async', async);
    }
});
