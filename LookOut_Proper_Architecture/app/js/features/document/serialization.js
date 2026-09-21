export function serializeLookOutDocument(documentModel) {
    return JSON.stringify(documentModel, null, 2);
}

export function parseLookOutDocument(text) {
    const data = JSON.parse(text);

    if (data.format !== "lookout") {
        throw new Error("Invalid LookOut project.");
    }

    return data;
}
