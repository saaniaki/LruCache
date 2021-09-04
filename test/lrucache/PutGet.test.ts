import { ILruCache } from '../../src/lrucache/abs/LruCache.interface';

describe("'Put' and 'Get' Tests", () => {
    const lruCache: ILruCache<string, any> = {
        capacity: 1,
        put(key: string, value: any) {
            return;
        },
        get(key: string): any {
            return;
        },
        delete(key: string): any {
            return;
        },
        reset() {
            return;
        },
    };

    for (let i = 1; i <= 10; i++) {
        const key = `key${i}`;
        const value = `value${i}`;
        lruCache.put(key, value);
        test(`Item number ${i} is cached`, () => {
            expect(lruCache.get(key)).toBe(value);
        });
    }
});
