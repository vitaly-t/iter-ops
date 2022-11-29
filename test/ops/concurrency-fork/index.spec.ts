import async from './async';
import sync from './sync';

describe('concurrencyFork', () => {
    describe('sync', sync);
    describe('async', async);
});
