export function createImageLayer(asset) {
    return {
        type: "image",
        assetId: asset.id,
        effects: [],
        opacity: 1,
        blendMode: "normal"
    };
}
