export class AssetManager {
    constructor() {
        this.assets = new Map();
    }

    add(asset) {
        this.assets.set(asset.id, asset);
        return asset;
    }

    get(id) {
        return this.assets.get(id) || null;
    }

    remove(id) {
        this.assets.delete(id);
    }

    list() {
        return [...this.assets.values()];
    }
}
