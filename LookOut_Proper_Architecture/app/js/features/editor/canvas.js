// Fabric is expected to be loaded by the application.
// This keeps Fabric as the rendering/canvas layer rather than the document source of truth.

export function createCanvas(elementId) {
    if (!window.fabric) {
        throw new Error("Fabric.js must be loaded before creating the LookOut canvas.");
    }

    const canvas = new fabric.Canvas(elementId, {
        preserveObjectStacking: true,
        selection: true
    });

    return canvas;
}
