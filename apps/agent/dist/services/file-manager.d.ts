import { TProduct, TCategory } from '@tdc/sync-protocol';
export declare class LocalFileManager {
    private dataDir;
    constructor();
    private ensureDataDir;
    getProducts(): Promise<TProduct[]>;
    getProduct(id: string): Promise<TProduct | null>;
    saveProduct(product: TProduct): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    getCategories(): Promise<TCategory[]>;
    getCategory(id: string): Promise<TCategory | null>;
    saveCategory(category: TCategory): Promise<void>;
    deleteCategory(id: string): Promise<void>;
    getLatestRevision(): Promise<number>;
}
