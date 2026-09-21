export function applyCrop(documentModel, crop) {
    documentModel.crop = { ...crop };
    return documentModel;
}
