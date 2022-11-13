import async from './async';
import sync from './sync';

describe('timeout', () => {
    describe('sync', sync);
    if (!process.env.EXCLUDE_RACE_TESTS) {
        // timeout racing tests get constantly screwed in test environment
        describe('async', async);
    }
});
