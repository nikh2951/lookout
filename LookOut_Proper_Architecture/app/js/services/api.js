/* =====================================================
   LOOKOUT API SERVICE
   ===================================================== */

const AI_API_BASE =
    window.LOOKOUT_AI_API_BASE || "/ai";

function resolveAIImageUrl(imageUrl) {
    if (!imageUrl) return "";

    if (
        AI_API_BASE.startsWith("/") &&
        imageUrl.startsWith("/")
    ) {
        return `${AI_API_BASE}${imageUrl}`;
    }

    return new URL(imageUrl, AI_API_BASE).href;
}

function resolveGeneratedImageUrl(data) {
    const imageUrl =
        data && (data.image_path || data.image_url);

    return resolveAIImageUrl(imageUrl);
}
