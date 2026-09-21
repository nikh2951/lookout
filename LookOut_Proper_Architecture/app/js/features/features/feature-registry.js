export class FeatureRegistry {
    constructor() {
        this.features = new Map();
    }

    register(feature) {
        if (!feature?.id) {
            throw new Error("Feature must have an id.");
        }

        this.features.set(feature.id, feature);
    }

    get(id, version = null) {
        const feature = this.features.get(id);

        if (!feature) return null;

        if (version && feature.version !== version) {
            return null;
        }

        return feature;
    }

    has(id, version = null) {
        return Boolean(this.get(id, version));
    }

    list() {
        return [...this.features.values()];
    }
}
