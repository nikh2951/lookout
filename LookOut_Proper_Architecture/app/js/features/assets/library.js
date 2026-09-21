export class LookOutLibrary {
    constructor() {
        this.items = new Map();
    }

    add(item) {
        this.items.set(item.id, item);
    }

    get(id) {
        return this.items.get(id) || null;
    }

    remove(id) {
        this.items.delete(id);
    }

    list() {
        return [...this.items.values()];
    }
}
