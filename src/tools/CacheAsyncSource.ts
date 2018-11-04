export class CacheAsyncSource<TId, TSource> {
    private storage: { id: TId; source: TSource | Promise<TSource> }[] = [];

    hasItem(id: TId) {
        return this.storage.some((item) => item.id === id);
    }

    async getItem(id: TId): Promise<TSource | null> {
        return (this.storage.find((item) => item.id === id) || { source: null })
            .source;
    }

    async setItem(id: TId, source: TSource | Promise<TSource>) {
        const item = { id, source };
        this.storage.push(item);
        if (item.source instanceof Promise) {
            item.source = await source;
        }
    }

    getCashedItemSync(id: TId): TSource | null {
        const item = this.storage.find((item) => item.id === id) || null;
        if (!item) {
            return null;
        } else if (item.source instanceof Promise) {
            return null;
        } else {
            return item.source;
        }
    }
}
