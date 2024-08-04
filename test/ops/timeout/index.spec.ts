import async from './async';
import sync from './sync';

describe('timeout', () => {
    describe('sync', sync);
    if (!process.env.EXCLUDE_RACE_TESTS) {
        // "timeout" racing tests are inconsistent in CI environment
        describe('async', async);
    }
});
