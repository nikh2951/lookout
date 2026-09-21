export function createTextObject(options = {}) {
    return {
        type: "text",
        text: options.text || "Text",
        fontFamily: options.fontFamily || "Arial",
        fontSize: options.fontSize || 48,
        fill: options.fill || "#ffffff",
        fontWeight: options.fontWeight || "normal",
        fontStyle: options.fontStyle || "normal",
        underline: Boolean(options.underline)
    };
}
