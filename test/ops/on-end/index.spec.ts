import async from './async';
import sync from './sync';

describe('onEnd', () => {
    describe('sync', sync);
    if (!process.env.EXCLUDE_RACE_TESTS) {
        // onEnd racing tests get constantly screwed in test environment
        describe('async', async);
    }
});
