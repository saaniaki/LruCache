import { ILruCache } from '../../src';
import { factory } from '../factory';

/**
 * Tests the Delete functionality of the LRU Cache implementation that the
 * factory function returns.
 */
describe("LruCache 'Delete' Tests", () => {
    /**
     * Consecutively inserts and deletes entries in a LRU Cache of capacity 1.
     * There should be no entry existing in the Cache att the end of each
     * iteration.
     */
    test(`Consecutive 'Put' and 'Delete'`, () => {
        const lruCache: ILruCache<string> = factory(1);

        for (let i = 1; i <= 10; i++) {
            const key = `key${i}`;
            const value = `value${i}`;
            lruCache.put(key, value);
            expect(lruCache.delete(key)).toBe(value);
            expect(lruCache.get(key)).toBeUndefined();
        }
    });

    /**
     * Consecutively inserts and retrieves 5 entries in a LRU Cache of
     * capacity 5 and then inserts 5 more entries. With each insertion
     * exceeding the capacity of the Cache, the oldest inserted needs to get
     * discarded and therefore, removing it from the Cache should have no
     * effect.
     */
    test("No-op 'Delete' + Ordered Discard Decision", () => {
        const capacity = 5;
        const lruCache: ILruCache<string> = factory(capacity);

        for (let i = 1; i <= capacity; i++) {
            lruCache.put(`key${i}`, `value${i}`);
        }

        for (let i = capacity + 1; i <= 2 * capacity; i++) {
            lruCache.put(`key${i}`, `value${i}`);
            expect(lruCache.get(`key${i - capacity}`)).toBeUndefined();
            expect(lruCache.delete(`key${i - capacity}`)).toBeUndefined();
        }
    });

    /**
     * Inserts 20 entries to a LRU Cache of capacity 20 and then randomly
     * removes the entries having an even key. Only the entries with odd
     * keys should then exist in the Cache.
     */
    test("Random 'Delete'", () => {
        const capacity = 20;
        const lruCache: ILruCache<string> = factory(capacity);

        const entries = new Array<{ key: string; value: any }>();
        for (let i = 1; i <= capacity; i++) {
            const key = `key${i}`;
            const value = `value${i}`;
            // Capture the key if its an even key.
            if (i % 2 == 0) {
                entries.push({ key, value });
            }
            lruCache.put(key, value);
        }

        // Shuffles the even keys captured so they have a random order.
        let currI = entries.length;
        while (currI != 0) {
            const randI = Math.floor(Math.random() * currI--);
            [entries[currI], entries[randI]] = [entries[randI], entries[currI]];
        }

        // Delete all even keys in a random order.
        for (const entry of entries) {
            expect(lruCache.delete(entry.key)).toBe(entry.value);
        }

        // Only the entries with odd keys should exist.
        for (let i = 1; i <= capacity; i++) {
            const key = `key${i}`;
            if (i % 2 == 0) {
                expect(lruCache.delete(key)).toBeUndefined();
            } else {
                expect(lruCache.get(key)).toBe(`value${i}`);
            }
        }
    });
});
