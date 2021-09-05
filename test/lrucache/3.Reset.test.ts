import { ILruCache } from '../../src';
import { factory } from '../factory';

/**
 * Tests the Reset functionality of the LRU Cache implementation that the
 * factory function returns.
 */
describe("LruCache 'Reset' Tests", () => {
    /**
     * Resetting a fresh instance of a LRU Cache should have no effect on
     * its functionality.
     */
    test(`'Reset' on Empty Cache`, () => {
        const capacity = 10;
        const lruCache: ILruCache<string, any> = factory(capacity);
        lruCache.reset();

        for (let i = 1; i <= capacity; i++) {
            lruCache.put(`key${i}`, `value${i}`);
        }

        for (let i = 1; i <= capacity; i++) {
            expect(lruCache.get(`key${i}`)).toBe(`value${i}`);
        }
    });

    /**
     * Resetting a half-full instance of a LRU Cache should have no effect on
     * its functionality.
     */
    test(`'Reset' on a Half-Full Cache`, () => {
        const halfOfCap = 5;
        const lruCache: ILruCache<string, any> = factory(halfOfCap * 2);

        for (let i = 1; i <= halfOfCap; i++) {
            lruCache.put(`key${i}`, `value${i}`);
        }

        lruCache.reset();

        for (let i = 1; i <= halfOfCap; i++) {
            expect(lruCache.get(`key${i}`)).toBeUndefined();
        }

        for (let i = halfOfCap + 1; i <= halfOfCap * 2; i++) {
            lruCache.put(`key${i}`, `value${i}`);
        }

        for (let i = halfOfCap + 1; i <= halfOfCap * 2; i++) {
            expect(lruCache.get(`key${i}`)).toBe(`value${i}`);
        }
    });

    /**
     * Resetting a full instance of a LRU Cache should have no effect on its
     * functionality.
     */
    test(`'Reset' on Full Cache`, () => {
        const capacity = 10;
        const lruCache: ILruCache<string, any> = factory(capacity);

        for (let i = 1; i <= capacity; i++) {
            lruCache.put(`key${i}`, `value${i}`);
        }

        lruCache.reset();

        for (let i = 1; i <= capacity; i++) {
            expect(lruCache.get(`key${i}`)).toBeUndefined();
        }
    });
});
