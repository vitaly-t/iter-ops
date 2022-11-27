import async from './async';
import sync from './sync';

describe('waitRace', () => {
    describe('sync', sync);
    describe('async', async);
});
