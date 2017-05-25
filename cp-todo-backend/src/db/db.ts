/**
 * This is pretty useless since every database would have a different implementation for each method
 */
export interface BaseDatabase {
    save<T>(obj: T): Promise<any>;
}
