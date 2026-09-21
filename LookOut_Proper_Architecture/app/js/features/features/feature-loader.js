// Loader foundation.
// A future downloadable package should be parsed and validated before registration.

import { validateFeaturePackage } from "./feature-validator.js";

export async function loadFeaturePackage(packageData, registry) {
    const validation = validateFeaturePackage(packageData);

    if (!validation.valid) {
        throw new Error(validation.errors.join("\n"));
    }

    registry.register(packageData.feature);

    return packageData.feature;
}
