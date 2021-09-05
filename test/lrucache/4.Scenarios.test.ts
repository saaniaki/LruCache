import { ILruCache } from '../../src';
import { factory } from '../factory';

/**
 * Tests all the functionalities (Put, Get, Delete, Reset) of the LRU Cache
 * implementation that the factory function returns.
 */
describe('LruCache Full Scenario', () => {
    /**
     * Manually inserts, retrieves and removes entries in an LRU Cache and
     * checks if the Cache has the correct entries stored in it. Also,
     * resets the Cache at some point to assure the Cache is fully functional.
     */
    test(`Scenario #1`, () => {
        const capacity = 5;
        const lruCache: ILruCache<string> = factory(capacity);

        lruCache.put(`key0`, undefined);
        expect(lruCache.get(`key1`)).toBeUndefined();

        // Creating [1]
        lruCache.put(`key1`, null);
        expect(lruCache.get(`key1`)).toBeNull();

        // Creating [5, 4, 3, 2, 1]
        lruCache.put(`key2`, `value2`);
        lruCache.put(`key3`, `value3`);
        lruCache.put(`key4`, `value4`);
        lruCache.put(`key5`, `value5`);

        // Creating [1, 5, 4, 3, 2]
        lruCache.put(`key1`, `value1`);

        // Creating [1, 5, 4, 2]
        lruCache.delete(`key3`);
        expect(lruCache.get(`key3`)).toBeUndefined();

        // Creating [4, 1, 5, 2]
        expect(lruCache.get(`key4`)).toBe(`value4`);

        // Creating [7, 6, 4, 1, 5]
        lruCache.put(`key6`, `value6`);
        lruCache.put(`key7`, `value7`);
        expect(lruCache.get(`key2`)).toBeUndefined();

        // Creating [7, 4, 1, 5]
        lruCache.delete(`key6`);
        expect(lruCache.get(`key6`)).toBeUndefined();

        // Creating [9, 8, 7, 4, 1]
        lruCache.put(`key8`, `value8`);
        lruCache.put(`key9`, `value9`);
        expect(lruCache.get(`key5`)).toBeUndefined();

        // Creating [1, 9, 8, 7, 4]
        lruCache.put(`key1`, `updatedValue1`);

        // Creating [1, 9, 7, 4]
        lruCache.delete(`key8`);
        expect(lruCache.get(`key8`)).toBeUndefined();

        // Creating [11, 10, 1, 9, 7]
        lruCache.put(`key10`, `value10`);
        lruCache.put(`key11`, `value11`);
        expect(lruCache.get(`key4`)).toBeUndefined();

        // Creating [1, 11, 10, 9, 7]
        expect(lruCache.get(`key1`)).toBe(`updatedValue1`);

        // Creating [12, 1, 11, 10, 9]
        lruCache.put(`key12`, `value12`);
        expect(lruCache.get(`key7`)).toBeUndefined();

        // Creating []
        lruCache.reset();
        expect(lruCache.get(`key12`)).toBeUndefined();
        expect(lruCache.get(`key1`)).toBeUndefined();
        expect(lruCache.get(`key11`)).toBeUndefined();
        expect(lruCache.get(`key10`)).toBeUndefined();
        expect(lruCache.get(`key9`)).toBeUndefined();

        // End of iteration 1: [1, 2]
        // End of iteration 2: [2, 3, 1]
        // End of iteration 3: [3, 4, 2, 1]
        // End of iteration 4: [4, 5, 3, 2, 1]
        lruCache.put(`key1`, `value1`);
        for (let i = 2; i <= capacity; i++) {
            lruCache.put(`key${i}`, `value${i}`);
            expect(lruCache.get(`key${i - 1}`)).toBe(`value${i - 1}`);
        }

        // creating [6, 4, 5, 3, 2]
        lruCache.put(`key6`, `value6`);
        expect(lruCache.get(`key1`)).toBeUndefined();

        // creating [7, 6, 4, 5, 3]
        lruCache.put(`key7`, `value7`);
        expect(lruCache.get(`key2`)).toBeUndefined();

        // creating [8, 7, 6, 4, 5]
        lruCache.put(`key8`, `value8`);
        expect(lruCache.get(`key3`)).toBeUndefined();

        // creating [9, 8, 7, 6, 4]
        lruCache.put(`key9`, `value9`);
        expect(lruCache.get(`key5`)).toBeUndefined();

        // creating [10, 9, 8, 7, 6]
        lruCache.put(`key10`, `value10`);
        expect(lruCache.get(`key4`)).toBeUndefined();
    });
});
