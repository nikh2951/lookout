export function exportProject(documentModel) {
    return JSON.stringify(documentModel, null, 2);
}

export function downloadText(text, filename = "project.lookout") {
    const blob = new Blob([text], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}
