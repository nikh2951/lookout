/* =====================================================
   LOOKOUT STORAGE SERVICE
   ===================================================== */

const GENERATED_IMAGES_KEY = "lookoutGeneratedImages";

const LookOutStorage = {

    get(key, fallback = null) {
        const value = localStorage.getItem(key);
        return value === null ? fallback : value;
    },

    set(key, value) {
        localStorage.setItem(key, value);
    },

    remove(key) {
        localStorage.removeItem(key);
    },

    getJSON(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : JSON.parse(value);
        } catch (error) {
            console.error(`Storage read failed for "${key}"`, error);
            return fallback;
        }
    },

    setJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

/* Generated image storage */

function getStoredGeneratedImages() {
    return LookOutStorage.getJSON(
        GENERATED_IMAGES_KEY,
        []
    );
}

function saveGeneratedImage(url) {
    if (!url) return;

    const images =
        getStoredGeneratedImages()
        .filter(item => item !== url);

    images.push(url);

    LookOutStorage.setJSON(
        GENERATED_IMAGES_KEY,
        images
    );
}
