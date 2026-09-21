import { createCanvas } from "./canvas.js";
import { SelectionManager } from "./selection.js";
import { LayerManager } from "./layers.js";
import { ToolManager } from "./tools.js";

export class LookOutEditor {
    constructor({
        canvasElementId,
        documentModel,
        history,
        featureRuntime,
        assets
    }) {
        this.canvasElementId = canvasElementId;
        this.document = documentModel;
        this.history = history;
        this.featureRuntime = featureRuntime;
        this.assets = assets;

        this.canvas = null;
        this.selection = null;
        this.layers = null;
        this.tools = null;
    }

    init() {
        this.canvas = createCanvas(this.canvasElementId);
        this.selection = new SelectionManager(this.canvas);
        this.layers = new LayerManager(this.canvas, this.document);
        this.tools = new ToolManager(this);

        return this;
    }
}
