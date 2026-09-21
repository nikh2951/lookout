export class SelectionManager {
    constructor(canvas) {
        this.canvas = canvas;
    }

    getActiveObject() {
        return this.canvas?.getActiveObject() || null;
    }

    clear() {
        this.canvas?.discardActiveObject();
        this.canvas?.requestRenderAll();
    }
}
