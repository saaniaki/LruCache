import { ILruCache, LruCache } from '../src';

/**
 * Returns an implementation of the LRU Cache interface.
 * @see ILruCache
 *
 * The current implementation is the LruCache. To test any other
 * implementation, this factory function needs to be modified to return the
 * to-be-tested instance of the concrete LRU Cache implementation.
 * @see LruCache
 *
 * @param capacity
 */
export const factory: (capacity: number) => ILruCache<any, any> = (
    capacity: number,
) => new LruCache(capacity);
