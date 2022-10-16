import { IDBPDatabase, openDB } from 'idb'

export class IdbWrapperClass {
  private readonly dbPromise: Promise<IDBPDatabase>
  private readonly storeName: string

  constructor(dbName = 'keyval-store', storeName = 'keyval') {
    this.storeName = storeName
    this.dbPromise = openDB(dbName, 1, {
      upgrade(db) {
        db.createObjectStore(storeName)
      }
    })
    console.log('IdbStore created')
  }

  public close = async () => {
    return (await this.dbPromise).close()
  }

  /**
   * Get a value by its key.
   *
   * @param key
   */
  get = async <T = any>(key: IDBValidKey): Promise<T | undefined> => {
    // console.log('db get ', key)
    return await (await this.dbPromise).get(this.storeName, key)
  }

  /**
   * Set a value with a key.
   *
   * @param key
   * @param value
   */
  set = async (key: IDBValidKey, value: any): Promise<void> => {
    await (await this.dbPromise).put(this.storeName, value, key)
  }

  /**
   * Set multiple values at once. This is faster than calling set() multiple times.
   * It's also atomic – if one of the pairs can't be added, none will be added.
   *
   * @param entries Array of entries, where each entry is an array of `[key, value]`.
   */
  setMany = async (entries: [IDBValidKey, any][]): Promise<void> => {
    const db = await this.dbPromise
    const tx = db.transaction(this.storeName, 'readwrite')
    const promises = entries.map((entrie) => tx.store.put(entrie[1], entrie[0]))
    await Promise.all([...promises, tx.done])
  }

  /**
   * Clear all values in the store.
   *
   */
  clear = async (): Promise<void> => {
    await (await this.dbPromise).clear(this.storeName)
  }
}
