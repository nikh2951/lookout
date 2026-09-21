export function createMask(options = {}) {
    return {
        type: "mask",
        mode: options.mode || "alpha",
        data: options.data || null
    };
}
