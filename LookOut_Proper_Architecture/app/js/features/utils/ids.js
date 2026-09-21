export function createId(prefix = "id") {
    if (crypto?.randomUUID) {
        return `${prefix}_${crypto.randomUUID()}`;
    }

    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}
