import { createId } from "../utils/ids.js";

export function createLookOutDocument(existing = {}) {
    return {
        format: "lookout",
        version: 1,
        id: existing.id || createId("project"),
        name: existing.name || "Untitled Project",
        width: existing.width || 1920,
        height: existing.height || 1080,
        background: existing.background || null,
        layers: existing.layers || [],
        assets: existing.assets || [],
        requiredFeatures: existing.requiredFeatures || [],
        metadata: existing.metadata || {}
    };
}
