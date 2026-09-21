export class LayerManager {
    constructor(canvas, documentModel) {
        this.canvas = canvas;
        this.document = documentModel;
    }

    addLayer(layer) {
        this.document.layers.push(layer);
        return layer;
    }

    removeLayer(layerId) {
        this.document.layers = this.document.layers.filter(
            layer => layer.id !== layerId
        );
    }

    reorder(layerId, newIndex) {
        const index = this.document.layers.findIndex(
            layer => layer.id === layerId
        );

        if (index === -1) return;

        const [layer] = this.document.layers.splice(index, 1);
        this.document.layers.splice(newIndex, 0, layer);
    }
}
