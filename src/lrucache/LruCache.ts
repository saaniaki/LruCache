import { ILruCache } from './abs/LruCache.interface';

export class LruCache<K, V> implements ILruCache<K, V> {
    readonly capacity: number = 0;

    delete(key: K): V | undefined {
        return undefined;
    }

    get(key: K): V | undefined {
        return undefined;
    }

    put(key: K, value: V): void {
        return;
    }

    reset(): void {
        return;
    }
}
