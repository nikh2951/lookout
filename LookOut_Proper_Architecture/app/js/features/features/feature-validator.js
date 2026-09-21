export function validateFeaturePackage(packageData) {
    const errors = [];

    if (!packageData || typeof packageData !== "object") {
        errors.push("Feature package must be an object.");
    }

    if (!packageData?.manifest) {
        errors.push("Feature package is missing a manifest.");
    }

    if (!packageData?.feature) {
        errors.push("Feature package is missing a feature definition.");
    }

    if (packageData?.manifest?.format !== "lookout-feature") {
        errors.push("Unsupported LookOut feature package format.");
    }

    if (!packageData?.manifest?.id) {
        errors.push("Feature manifest requires an id.");
    }

    if (!packageData?.manifest?.version) {
        errors.push("Feature manifest requires a version.");
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
