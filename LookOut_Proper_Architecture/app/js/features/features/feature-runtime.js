// Runtime foundation for future downloadable LookOut-created features.
// Do NOT execute arbitrary JavaScript from downloaded files.
// Future feature packages should use a validated LookOut-defined format/graph/runtime.

export class FeatureRuntime {
    constructor({ registry }) {
        this.registry = registry;
    }

    register(feature) {
        this.registry.register(feature);
    }

    has(featureId, version = null) {
        return this.registry.has(featureId, version);
    }

    require(featureRequirement) {
        const { id, version } = featureRequirement;

        if (!this.has(id, version)) {
            const error = new Error(
                `Required LookOut feature is not installed: ${id}@${version || "*"}`
            );
            error.code = "FEATURE_MISSING";
            error.feature = featureRequirement;
            throw error;
        }

        return this.registry.get(id, version);
    }

    execute(featureId, context) {
        const feature = this.registry.get(featureId);

        if (!feature) {
            throw new Error(`Feature is not installed: ${featureId}`);
        }

        // Future implementation:
        // validate graph -> execute LookOut primitives -> return output.
        if (typeof feature.execute !== "function") {
            throw new Error(`Feature has no executable runtime: ${featureId}`);
        }

        return feature.execute(context);
    }
}
