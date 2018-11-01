export class CacheAsyncSource<TId, TSource> {
    private storage: { id: TId; source: TSource | Promise<TSource> }[] = [];

    hasItem(id: TId) {
        return this.storage.some((item) => item.id === id);
    }

    async getItem(id: TId): Promise<TSource | null> {
        return (this.storage.find((item) => item.id === id) || { source: null })
            .source;
    }

    setItem(id: TId, source: TSource | Promise<TSource>) {
        return this.storage.push({ id, source });
    }
}
