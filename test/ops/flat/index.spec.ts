import explicitAsync from './async';
import explicitSync from './sync';
import duelAsync from './duel.async';
import duelSync from './duel.sync';

describe('flat', () => {
    describe('explicit', () => {
        describe('sync', explicitSync);
        describe('async', explicitAsync);
    });

    describe('duel', () => {
        describe('sync', duelSync);
        describe('async', duelAsync);
    });
});
