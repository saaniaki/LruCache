import { ILruCache, LruCache } from '../../src';

describe("'Put' and 'Get' Tests", () => {
    const lruCache: ILruCache<string, any> = new LruCache();

    for (let i = 1; i <= 10; i++) {
        const key = `key${i}`;
        const value = `value${i}`;
        lruCache.put(key, value);
        test(`Item number ${i} is cached`, () => {
            expect(lruCache.get(key)).toBe(value);
        });
    }
});
