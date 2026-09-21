// Foundation for built-in and future custom LookOut brushes.
export function createBrushDefinition(options = {}) {
    return {
        id: options.id || "lookout.brush.basic",
        name: options.name || "Basic Brush",
        version: options.version || "1.0.0",
        settings: options.settings || {}
    };
}
