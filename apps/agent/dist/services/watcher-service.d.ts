export declare class WatcherService {
    private fileManager;
    private cloudBaseUrl;
    private syncToken;
    private watcher;
    private isWatching;
    constructor();
    /**
     * Start watching for file changes
     */
    start(): Promise<void>;
    /**
     * Stop watching for file changes
     */
    stop(): Promise<void>;
    /**
     * Handle file change events
     */
    private handleFileChange;
    /**
     * Build change object from file path and event
     */
    private buildChangeFromFile;
    private buildProductChange;
    private buildCategoryChange;
    /**
     * Push change to cloud
     */
    private pushChangeToCloud;
    /**
     * Extract entity ID from file path
     */
    private extractIdFromPath;
}
