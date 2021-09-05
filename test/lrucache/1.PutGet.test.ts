import { ILruCache } from '../../src';
import { factory } from '../factory';

/**
 * Tests the Put and Get functionality of the LRU Cache implementation that
 * the factory function returns.
 */
describe("LruCache 'Put' and 'Get' Tests", () => {
    /**
     * Consecutively inserts and retrieves entries in a LRU Cache of capacity 1.
     * At all times, there should be only one entry existing in the Cache and
     * that's the very last entry inserted.
     */
    test(`Consecutive 'Put' and 'Get'`, () => {
        const lruCache: ILruCache<string, any> = factory(1);

        for (let i = 1; i <= 10; i++) {
            const key = `key${i}`;
            const value = `value${i}`;
            lruCache.put(key, value);
            expect(lruCache.get(key)).toBe(value);
        }
    });

    /**
     * Consecutively inserts and retrieves 5 entries in a LRU Cache of
     * capacity 5 and then inserts 5 more entries. With each insertion
     * exceeding the capacity of the Cache, the oldest inserted needs to get
     * discarded.
     */
    test('Consecutive Discard Decision', () => {
        const capacity = 5;
        const lruCache: ILruCache<string, any> = factory(capacity);

        for (let i = 1; i <= capacity; i++) {
            lruCache.put(`key${i}`, `value${i}`);
        }

        for (let i = capacity + 1; i <= 2 * capacity; i++) {
            const key = `key${i}`;
            const value = `value${i}`;
            lruCache.put(key, value);
            expect(lruCache.get(key)).toBe(value);
            expect(lruCache.get(`key${i - capacity}`)).toBeUndefined();
        }
    });

    /**
     * Consecutively inserts and retrieves 5 entries in a LRU Cache of
     * capacity 5 and then updates 1st, 3rd and 5th entries. All items
     * should exist in the Cache with the correct values.
     */
    test("'Put' as Update", () => {
        const capacity = 5;
        const lruCache: ILruCache<string, any> = factory(capacity);

        for (let i = 1; i <= capacity; i++) {
            lruCache.put(`key${i}`, `value${i}`);
        }

        for (let i = 1; i <= capacity; i += 2) {
            lruCache.put(`key${i}`, `updatedValue${i}`);
        }

        for (let i = 1; i <= capacity; i++) {
            if (i % 2 == 1) {
                expect(lruCache.get(`key${i}`)).toBe(`updatedValue${i}`);
            } else {
                expect(lruCache.get(`key${i}`)).toBe(`value${i}`);
            }
        }
    });

    /**
     * Inserting undefined as the key of an entry is illegal i.e. an entry with
     * key of undefined should not be Cached and an error should be thrown.
     */
    test("'Put' undefined Key", () => {
        const capacity = 5;
        const lruCache: ILruCache<string | undefined, any> = factory(capacity);

        expect(() => lruCache.put(undefined, `undefinedValue`)).toThrow(
            /undefined/,
        );
        expect(lruCache.get(undefined)).toBeUndefined();
    });

    /**
     * Inserting null as the key of an entry is legal i.e. an entry with
     * key of null can be added and cached.
     */
    test("'Put' null Key", () => {
        const capacity = 5;
        const lruCache: ILruCache<string | null, any> = factory(capacity);

        lruCache.put(null, `nullValue`);
        expect(lruCache.get(null)).toBe(`nullValue`);

        for (let i = 1; i <= capacity; i++) {
            lruCache.put(`key${i}`, `value${i}`);
        }
        expect(lruCache.get(null)).toBeUndefined();
    });

    /**
     * Inserting undefined should be a no-op i.e. an entry with value of
     * undefined can never exist in the Cache.
     */
    test("'Put' undefined Value", () => {
        const capacity = 5;
        const lruCache: ILruCache<string, any> = factory(capacity);

        lruCache.put(`key0`, undefined);
        expect(lruCache.get(`key0`)).toBeUndefined();

        for (let i = 1; i <= capacity; i++) {
            lruCache.put(`key${i}`, `value${i}`);
        }
        expect(lruCache.get(`key0`)).toBeUndefined();

        lruCache.put(`key0`, undefined);
        expect(lruCache.get(`key0`)).toBeUndefined();
    });

    /**
     * Inserting null is legal i.e. an entry with value of null can be added and
     * cached.
     */
    test("'Put' null Value", () => {
        const capacity = 5;
        const lruCache: ILruCache<string, any> = factory(capacity);

        lruCache.put(`key0`, null);
        expect(lruCache.get(`key0`)).toBeNull();

        for (let i = 1; i <= capacity; i++) {
            lruCache.put(`key${i}`, `value${i}`);
        }
        expect(lruCache.get(`key0`)).toBeUndefined();

        lruCache.put(`key0`, null);
        expect(lruCache.get(`key0`)).toBeNull();
    });

    /**
     * Inserts entries and then updates them to bring them to the top of the
     * Cache.
     */
    test("Unordered Discard Decision + 'Put' as Update", () => {
        const capacity = 5;
        const lruCache: ILruCache<string, any> = factory(capacity);

        // Creating [5, 4, 3, 2, 1]
        lruCache.put(`key1`, `value1`);
        lruCache.put(`key2`, `value2`);
        lruCache.put(`key3`, `value3`);
        lruCache.put(`key4`, `value4`);
        lruCache.put(`key5`, `value5`);
        expect(lruCache.get(`key5`)).toBe(`value5`);

        // Creating [1, 5, 4, 3, 2]
        lruCache.put(`key1`, `updatedValue1`);
        expect(lruCache.get(`key1`)).toBe(`updatedValue1`);

        // Creating [6, 1, 5, 4, 3]
        lruCache.put(`key6`, `value6`);
        expect(lruCache.get(`key6`)).toBe(`value6`);
        expect(lruCache.get(`key2`)).toBeUndefined();

        // Creating [4, 6, 1, 5, 3]
        lruCache.put(`key4`, `updatedValue4`);
        expect(lruCache.get(`key4`)).toBe(`updatedValue4`);

        // Creating [3, 4, 6, 1, 5]
        lruCache.put(`key3`, `updatedValue3`);
        expect(lruCache.get(`key3`)).toBe(`updatedValue3`);

        // Creating [7, 3, 4, 6, 1]
        lruCache.put(`key7`, `updatedValue7`);
        expect(lruCache.get(`key7`)).toBe(`value7`);
        expect(lruCache.get(`key5`)).toBeUndefined();
    });

    /**
     * Inserts entries and then retrieves them to bring them to the top of the
     * Cache.
     */
    test("Unordered Discard Decision + 'Get' as Key Usage", () => {
        const capacity = 5;
        const lruCache: ILruCache<string, any> = factory(capacity);

        // Creating [3, 2, 1]
        lruCache.put(`key1`, `value1`);
        lruCache.put(`key2`, `value2`);
        lruCache.put(`key3`, `value3`);

        // Creating [1, 3, 2]
        expect(lruCache.get(`key1`)).toBe('value1');

        // Creating [5, 4, 1, 3, 2]
        lruCache.put(`key4`, `value4`);
        lruCache.put(`key5`, `value5`);

        // Creating [3, 5, 4, 1, 2]
        expect(lruCache.get(`key3`)).toBe('value3');

        // Creating [6, 3, 5, 4, 1]
        lruCache.put(`key6`, `value6`);
        expect(lruCache.get(`key2`)).toBeUndefined();

        // Creating [7, 6, 3, 5, 4]
        lruCache.put(`key7`, `value7`);
        expect(lruCache.get(`key1`)).toBeUndefined();

        // Creating [8, 7, 6, 3, 5]
        lruCache.put(`key8`, `value8`);
        expect(lruCache.get(`key4`)).toBeUndefined();

        // Creating [9, 8, 7, 6, 3]
        lruCache.put(`key9`, `value9`);
        expect(lruCache.get(`key5`)).toBeUndefined();

        // Creating [10, 9, 8, 7, 6]
        lruCache.put(`key10`, `value10`);
        expect(lruCache.get(`key3`)).toBeUndefined();
    });

    /**
     * Inserts entries and then brings them to the top of the Cache by both
     * updating and retrieving them.
     */
    test("Unordered Discard Decision + 'Put' as Update + 'Get' as Key Usage", () => {
        const capacity = 5;
        const lruCache: ILruCache<string, any> = factory(capacity);

        // Creating [1, 2]
        lruCache.put(`key1`, `value1`);
        lruCache.put(`key2`, `value2`);
        lruCache.put(`key1`, `updatedValue1`);

        // Creating [3, 1, 2]
        lruCache.put(`key3`, `value3`);

        // Creating [1, 3, 2]
        expect(lruCache.get(`key1`)).toBe('updatedValue1');

        // Creating [5, 4, 1, 3, 2]
        lruCache.put(`key4`, `value4`);
        lruCache.put(`key5`, `value5`);

        // Creating [3, 5, 4, 1, 2]
        expect(lruCache.get(`key3`)).toBe('value3');

        // Creating [4, 3, 5, 1, 2]
        lruCache.put(`key4`, `updatedValue4`);

        // Creating [3, 4, 5, 1, 2]
        lruCache.put(`key3`, `updatedValue3`);

        // Creating [4, 3, 5, 1, 2]
        expect(lruCache.get(`key4`)).toBe('updatedValue4');

        // Creating [2, 4, 3, 5, 1]
        expect(lruCache.get(`key2`)).toBe('value2');

        // Creating [6, 2, 4, 3, 5]
        lruCache.put(`key6`, `value6`);
        expect(lruCache.get(`key1`)).toBeUndefined();

        // Creating [7, 6, 2, 4, 3]
        lruCache.put(`key7`, `value7`);
        expect(lruCache.get(`key5`)).toBeUndefined();

        // Creating [8, 7, 6, 2, 4]
        lruCache.put(`key8`, `value8`);
        expect(lruCache.get(`key3`)).toBeUndefined();

        // Creating [9, 8, 7, 6, 2]
        lruCache.put(`key9`, `value9`);
        expect(lruCache.get(`key4`)).toBeUndefined();

        // Creating [10, 9, 8, 7, 6]
        lruCache.put(`key10`, `value10`);
        expect(lruCache.get(`key2`)).toBeUndefined();
    });
});
