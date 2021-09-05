import { ILruCache } from './abs/LruCache.interface';
import { LruCacheNode } from './LruCacheNode';

/**
 * LRU Cache Class
 *
 * An implementation of the LRU Cache interface using the native ES6 Map and
 * a custom Doubly Linked List. The entries of the Cache will be added to an
 * encapsulated Map if there is still room left and the capacity is not
 * exceeded. The values of the encapsulated Map are LRU Cache Nodes which
 * encapsulate the user-entered key and value. LRU Cache entries form a
 * Doubly Linked List which is then used to rank the values based on their
 * usage frequency.
 *
 * This implementation uses two dummy nodes as the Head and Tail of the
 * Doubly Linked List to eliminate the necessity and complexity of dealing
 * with an empty list.
 *
 * Choosing a Map over an Object to store the key-value pairs is a good
 * choice since Objects are not optimized for frequent additions and
 * removals of key-value pairs. Also, the amortized time complexity of
 * accessing, searching, inserting, updating and deletion of an entry is
 * Ω(1), Θ(1) and O(n).
 *
 * @see LruCacheNode
 */
export class LruCache<K, V> implements ILruCache<K, V> {
    /**
     * A dummy node as the Head of the Doubly Linked List.
     * @protected
     */
    protected readonly head: LruCacheNode<K, V>;

    /**
     * A dummy node as the Tail of the Doubly Linked List.
     * @protected
     */
    protected readonly tail: LruCacheNode<K, V>;

    /**
     * A Map to store the entries of the Cache.
     *
     * @private
     */
    private accessMap: Map<K, LruCacheNode<K, V>>;

    /**
     * LRU Cache Constructor
     *
     * Checks if the capacity is a valid positive integer and then initializes
     * the Cache by instantiating the Access Map, Head and Tail properties.
     * Next, connects the Head and Tail dummy nodes to form a Doubly Linked
     * List with no elements.
     *
     * @param capacity
     */
    public constructor(public readonly capacity: number) {
        if (capacity < 1 || !Number.isInteger(capacity)) {
            throw new Error(
                `Received illegal capacity = '${capacity}'; ` +
                    `capacity must be an integer greater than or equal to one.`,
            );
        }
        this.accessMap = new Map<K, LruCacheNode<K, V>>();
        this.head = new LruCacheNode();
        this.tail = new LruCacheNode();
        this.initListLinks();
    }

    /**
     * Connects the Head and Tail dummy nodes to each other to form a Doubly
     * Linked List with no elements. The JS runtime garbage collector will
     * remove any items in between since they are not referenced anymore.
     *
     * @private
     */
    private initListLinks() {
        this.head.next = this.tail;
        this.tail.previous = this.head;
    }

    /**
     * Returns the number of currently Cached entries.
     */
    public get size(): number {
        return this.accessMap.size;
    }

    /**
     * Checks if emptiness of the Cache.
     */
    public isEmpty(): boolean {
        return this.size == 0;
    }

    /**
     * Resets the Cache, i.e. removes all the elements from the Cache.
     * The time complexity of this method is Ω(1), Θ(1) and O(1) since the
     * number of operations are always the same and are not a function of
     * the number of Cache entries.
     */
    public reset(): void {
        this.accessMap = new Map<K, LruCacheNode<K, V>>();
        this.initListLinks();
    }

    /**
     * TODO
     *
     * @param key
     * @param value
     */
    public put(key: K, value: V): void {
        return;
    }

    /**
     * TODO
     *
     * @param key
     */
    public get(key: K): V | undefined {
        return;
    }

    /**
     * TODO
     *
     * @param key
     */
    public delete(key: K): V | undefined {
        return;
    }
}
