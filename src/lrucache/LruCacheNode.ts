/**
 * LRU Cache Node Class
 *
 * The LRU Cache Node instances act as the nodes of a Doubly Linked List nodes.
 * Each of these nodes have a link to their previous and next LRU Cache Node
 * while also including the key and value of the entry.
 *
 * Storing the key of the entry is important since it creates a way to
 * address the entry inside the Cache map if need be.
 *
 * Generics:
 *  - K is the type of the node key.
 *  - V is the type of the node value.
 */
export class LruCacheNode<K, V> {
    /**
     * Optional link to the previous node. Tail node will not have this
     * property set.
     */
    public previous?: LruCacheNode<K, V>;

    /**
     * Optional link to the next node. Head node will not have this
     * property set.
     */
    public next?: LruCacheNode<K, V>;

    /**
     * Constructor with its overloads. Both key and value are optional since
     * the Head and Tail nodes will not have them set.
     */
    public constructor();
    public constructor(key: K, value: V);
    public constructor(public key?: K, public value?: V) {}

    /**
     * Overriding the string representation of LRU Cache Node.
     */
    public toString(): string {
        return `{${this.key} => ${this.value}}`;
    }
}
