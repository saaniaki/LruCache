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
 * NOTE: Top, beginning or head of the list holds the Most Recently Used entry
 * and the bottom, end or tail of the list holds the Least Recently Used entry.
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
     * of Access Map is the upper bound.
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
