import explicitAsync from './async';
import explicitSync from './sync';
import duelAsync from './duel.async';
import duelSync from './duel.sync';

describe('timeout', () => {
    describe('explicit', () => {
        describe('sync', explicitSync);
        if (!process.env.EXCLUDE_RACE_TESTS) {
            // timeout racing tests get constantly screwed in test environment
            describe('async', explicitAsync);
        }
    });

    describe('duel', () => {
        describe('sync', duelSync);
        if (!process.env.EXCLUDE_RACE_TESTS) {
            // timeout racing tests get constantly screwed in test environment
            describe('async', duelAsync);
        }
    });
});
