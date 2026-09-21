export function featureRequirement(id, version) {
    return {
        id,
        version
    };
}

export function isCompatible(installedVersion, requiredVersion) {
    // Initial foundation: exact version matching.
    // A proper semver compatibility policy can be introduced later.
    return installedVersion === requiredVersion;
}
