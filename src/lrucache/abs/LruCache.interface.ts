/**
 * LRU Cache Interface
 *
 * An LRU cache holds N number (N = capacity) of key-pair entries, and as the
 * name suggests, it discards the Least-Recently Used entry when adding new keys
 * cause the capacity to be exceeded.
 *
 * All implementation of LRU Cache must implement the following interface.
 */
export interface ILruCache<K = any, V = any> {
    /**
     * The maximum number of cached key-pair entries.
     */
    readonly capacity: number;

    /**
     * Caches a new or updates an exiting entry (key => value). This action is
     * considered a 'use' of the cached/updated key.
     *
     * @param key
     * @param value
     */
    put(key: K, value: V): void;

    /**
     * Retrieves an already cached value where the entry key matches the passed
     * key. This action is considered a 'use' of the retrieved key.
     *
     * @param key
     */
    get(key: K): V | undefined;

    /**
     * Deletes an already cached value where the entry key matches the passed
     * key.
     *
     * @param key
     */
    delete(key: K): V | undefined;

    /**
     * Resets the cache and discards all the cached items.
     */
    reset(): void;
}
