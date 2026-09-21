export class FontManager {
    constructor() {
        this.fonts = new Map();
    }

    register(font) {
        this.fonts.set(font.id, font);
    }

    get(id) {
        return this.fonts.get(id) || null;
    }

    list() {
        return [...this.fonts.values()];
    }
}
