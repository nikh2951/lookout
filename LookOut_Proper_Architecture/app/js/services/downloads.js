/* =====================================================
   LOOKOUT DOWNLOAD SERVICE
   ===================================================== */

async function downloadImageUrl(url, filename) {
    if (!url) return;

    const cleanUrl =
        url.split("?")[0];

    try {
        const response =
            await fetch(url);

        const blob =
            await response.blob();

        const objectUrl =
            URL.createObjectURL(blob);

        triggerDownload(
            objectUrl,
            filename ||
            cleanUrl.split("/").pop() ||
            "lookout-image.png"
        );

        setTimeout(
            () => URL.revokeObjectURL(objectUrl),
            1000
        );

    } catch (error) {

        triggerDownload(
            cleanUrl,
            filename ||
            cleanUrl.split("/").pop() ||
            "lookout-image.png"
        );
    }
}

function triggerDownload(url, filename) {
    const link =
        document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();
}

function createDownloadButton(url, filename) {
    const button =
        document.createElement("button");

    button.className =
        "download-image-btn";

    button.type = "button";

    button.innerHTML =
        '<i class="fa-solid fa-download"></i>';

    button.onclick =
        () => downloadImageUrl(url, filename);

    return button;
}
