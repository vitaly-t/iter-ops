import explicitAsync from './async';
import duelAsync from './duel.async';
import duelSync from './duel.sync';

describe('wait', () => {
    describe('explicit', () => {
        describe('async', explicitAsync);
    });

    describe('duel', () => {
        describe('sync', duelSync);
        describe('async', duelAsync);
    });
});
