import { serializeLookOutDocument, parseLookOutDocument } from "./serialization.js";

export function saveProject(documentModel) {
    return serializeLookOutDocument(documentModel);
}

export function loadProject(text) {
    return parseLookOutDocument(text);
}
