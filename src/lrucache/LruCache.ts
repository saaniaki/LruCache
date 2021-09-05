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
 * Top, beginning or head of the list holds the Most Recently Used entry
 * and the bottom, end or tail of the list holds the Least Recently Used entry.
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
     *
     * @protected
     */
    protected readonly head: LruCacheNode<K, V>;

    /**
     * A dummy node as the Tail of the Doubly Linked List.
     *
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
     * Retrieves the first node after the dummy Head node. Returns undefined
     * if there is none.
     *
     * Time complexity: Ω(1), Θ(1) and O(1).
     *
     * @private
     */
    private get firstNode(): LruCacheNode<K, V> | undefined {
        return this.isEmpty() ? undefined : this.head.next;
    }

    /**
     * Retrieves the last node before the dummy Tail node. Returns undefined
     * if there is none.
     *
     * Time complexity: Ω(1), Θ(1) and O(1).
     *
     * @private
     */
    private get lastNode(): LruCacheNode<K, V> | undefined {
        return this.isEmpty() ? undefined : this.tail.previous;
    }

    /**
     * Links a new node to the passed predecessor and successor nodes.
     *
     * Time complexity: Ω(1), Θ(1) and O(1).
     *
     * @param newNode
     * @param predecessor
     * @param successor
     * @private
     */
    private link(
        newNode: LruCacheNode<K, V>,
        predecessor: LruCacheNode<K, V>,
        successor: LruCacheNode<K, V>,
    ): void {
        newNode.previous = predecessor;
        newNode.next = successor;
        predecessor.next = newNode;
        successor.previous = newNode;
    }

    /**
     * Unlinks and removes a node from the list by linking its predecessor
     * node to its successor and vice versa.
     *
     * Time complexity: Ω(1), Θ(1) and O(1).
     *
     * @param node
     * @private
     */
    private unlink(node: LruCacheNode<K, V>): LruCacheNode<K, V> {
        const predecessor: LruCacheNode<K, V> | undefined = node.previous;
        const successor: LruCacheNode<K, V> | undefined = node.next;

        if (predecessor === undefined || successor === undefined) {
            throw new Error(`The Head or Tail nodes should not get unlinked.`);
        }

        predecessor.next = successor;
        successor.previous = predecessor;

        return node;
    }

    /**
     * Inserts a node to the beginning of the list.
     *
     * Precondition: The Head node must always have a next node attached to it.
     *
     * Time complexity: Ω(1), Θ(1) and O(1).
     *
     * @param newNode
     * @private
     */
    private linkToHead(newNode: LruCacheNode<K, V>): void {
        if (this.head.next === undefined) {
            throw new Error(
                `Precondition failed: Head node must always have a next node attached to it.`,
            );
        }

        this.link(newNode, this.head, this.head.next);
    }

    /**
     * Inserts a node to the end of the list.
     *
     * Precondition: The Tail node must always have a previous node attached to
     * it.
     *
     * Time complexity: Ω(1), Θ(1) and O(1).
     *
     * @param newNode
     * @private
     */
    private linkToTail(newNode: LruCacheNode<K, V>): void {
        if (this.tail.previous === undefined) {
            throw new Error(
                `Precondition failed: Tail node must always have a previous node attached to it.`,
            );
        }

        this.link(newNode, this.tail.previous, this.tail);
    }

    /**
     * Removes the first node from the beginning of the list. Returns undefined
     * if there is none.
     *
     * Precondition: The Head node must always have a next node attached to it.
     *
     * Time complexity: Ω(1), Θ(1) and O(1).
     *
     * @private
     */
    private unlinkFromHead(): LruCacheNode<K, V> | undefined {
        if (this.head.next === undefined) {
            throw new Error(
                `Precondition failed: Head node must always have a next node attached to it.`,
            );
        }

        return this.isEmpty() ? undefined : this.unlink(this.head.next);
    }

    /**
     * Removes the last node from the end of the list. Returns undefined
     * if there is none.
     *
     * Precondition: The Tail node must always have a previous node attached to
     * it.
     *
     * Time complexity: Ω(1), Θ(1) and O(1).
     *
     * @private
     */
    private unlinkFromTail(): LruCacheNode<K, V> | undefined {
        if (this.tail.previous === undefined) {
            throw new Error(
                `Precondition failed: Tail node must always have a previous node attached to it.`,
            );
        }

        return this.isEmpty() ? undefined : this.unlink(this.tail.previous);
    }

    /**
     * Moves the passed node from anywhere in the list to the beginning of
     * list if it's already not at the beginning.
     *
     * Time complexity: Ω(1), Θ(1) and O(1) since each of the components
     * have constant runtimes.
     *
     * @param node
     * @private
     */
    private moveNodeToHead(node: LruCacheNode<K, V>): LruCacheNode<K, V> {
        if (this.firstNode !== node) {
            this.unlink(node);
            this.linkToHead(node);
        }
        return node;
    }

    /**
     * Discard and removes the Least Recently Used entry in two steps:
     *  1- Unlinks the very last node from the end of the list.
     *  2- If step #1 returned a node and the list was not empty, removes the
     *     unlinked node from the Access Map.
     * Returns a boolean to informs the caller about the success or failure
     * of discarding the LRU entry.
     *
     * Time complexity: Ω(1), Θ(1) and O(n) since the deletion of an entry
     * from the Access Map is the upper bound.
     *
     * @private
     */
    private discardLeastRecentlyUsed(): boolean {
        // Ω(1), Θ(1) and O(1)
        const nodeTobeRemoved = this.unlinkFromTail();
        return (
            nodeTobeRemoved !== undefined &&
            nodeTobeRemoved.key !== undefined &&
            // Upper bound = Ω(1), Θ(1) and O(n)
            this.accessMap.delete(nodeTobeRemoved.key)
        );
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
     * Caches a new or updates an exiting entry (key => value). This action is
     * considered a 'use' of the cached/updated key.
     *
     * Inserting undefined as the key of an entry is illegal i.e. an entry with
     * key of undefined would not be Cached and an error would be thrown.
     *
     * Inserting undefined as the value of an entry is a no-op i.e. an entry
     * with value of undefined can never exist in the Cache.
     *
     * Time complexity: Ω(1), Θ(1) and O(n) since inserting, updating and
     * removing an entry Access Map is the upper bound.
     *
     * @param key
     * @param value
     */
    public put(key: K, value: V): void {
        // undefined key is reserved for the Head and Tail nodes for
        // consistency.
        if (key === undefined) {
            throw new Error(
                `Received illegal key of undefined; undefined is not a valid entry key.`,
            );
        }

        // undefined value is reserved for non-existing values.
        if (value === undefined) {
            return;
        }

        // Upper bound = Ω(1), Θ(1) and O(n)
        if (this.accessMap.has(key)) {
            // If the Access Map has an entry associated with the passed
            // key, the entry needs to get updated, i.e. the encapsulated value
            // of the node needs to get updated.

            // Casting is safe since the Access Map 'has' check is passed.
            // Upper bound = Ω(1), Θ(1) and O(n)
            const node: LruCacheNode<K, V> = this.accessMap.get(
                key,
            ) as LruCacheNode<K, V>;
            node.value = value;

            // Since the entry was updated and write operation is considered
            // as a 'use', the node should get moved to the top of the list.
            // Ω(1), Θ(1) and O(1)
            this.moveNodeToHead(node);
        } else {
            // If the Access Map does not include the passed key, a new node
            // needs to get created and inserted in both the Access Map and
            // the usage list.

            const newNode = new LruCacheNode(key, value);
            if (
                // If there is still room for another item OR
                this.accessMap.size < this.capacity ||
                // There is no room left AND (but) the LRU got removed
                // successfully (so now there should be enough room)
                // Upper bound = Ω(1), Θ(1) and O(n)
                this.discardLeastRecentlyUsed()
            ) {
                // Then add the newly created node to the Access Map,
                // Upper bound = Ω(1), Θ(1) and O(n)
                this.accessMap.set(key, newNode);
                // And link it to the top of the list.
                // Ω(1), Θ(1) and O(1)
                this.linkToHead(newNode);
            } else {
                throw new Error(
                    `The requested node has not been added; could not discard the least recently used element.`,
                );
            }
        }
    }

    /**
     * Retrieves an already cached value where the entry key matches the passed
     * key. This action is considered a 'use' of the retrieved key. Returns
     * undefined if there is no entry associated with the passed key.
     *
     * Time complexity: Ω(1), Θ(1) and O(n) since accessing/searching Access
     * Map for an entry is the upper bound.
     *
     * @param key
     */
    public get(key: K): V | undefined {
        // Upper bound = Ω(1), Θ(1) and O(n)
        const node = this.accessMap.get(key);
        const value =
            // Ω(1), Θ(1) and O(1)
            node !== undefined ? this.moveNodeToHead(node).value : undefined;
        return value !== undefined ? value : undefined;
    }

    /**
     * Deletes an already cached value where the entry key matches the passed
     * key. Returns the value of the removed entry or undefined if no entry
     * was removed.
     *
     * @param key
     */
    public delete(key: K): V | undefined {
        // Upper bound = Ω(1), Θ(1) and O(n)
        const node = this.accessMap.get(key);
        if (node !== undefined) {
            // Ω(1), Θ(1) and O(1)
            this.unlink(node);
            // Upper bound = Ω(1), Θ(1) and O(n)
            this.accessMap.delete(key);
            return node.value;
        }

        return;
    }
}
