export function createShape(type, options = {}) {
    return {
        type: "shape",
        shapeType: type,
        ...options
    };
}
