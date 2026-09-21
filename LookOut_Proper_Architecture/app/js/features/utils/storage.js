export function storageGet(key, fallback = null) {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
    } catch {
        return fallback;
    }
}

export function storageSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function storageRemove(key) {
    localStorage.removeItem(key);
}
