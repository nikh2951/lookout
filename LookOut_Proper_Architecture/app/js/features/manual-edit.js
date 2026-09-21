// Manual Edit page/controller.
// This file owns the Manual Edit UI lifecycle.
// Actual editing logic belongs in editor/, tools/, document/, history/, etc.

import { LookOutEditor } from "./editor/editor.js";
import { createLookOutDocument } from "./document/document.js";
import { HistoryManager } from "./history/history.js";
import { FeatureRuntime } from "./features/feature-runtime.js";
import { FeatureRegistry } from "./features/feature-registry.js";
import { AssetManager } from "./assets/asset-manager.js";
import { exportProject } from "./export/export.js";

export function initManualEdit(options = {}) {
    const canvasElementId = options.canvasElementId || "manualEditorCanvas";

    const documentModel = createLookOutDocument(options.project);
    const history = new HistoryManager();

    const registry = new FeatureRegistry();
    const featureRuntime = new FeatureRuntime({ registry });

    const assets = new AssetManager();

    const editor = new LookOutEditor({
        canvasElementId,
        documentModel,
        history,
        featureRuntime,
        assets
    });

    editor.init();

    return {
        editor,
        documentModel,
        history,
        featureRuntime,
        assets,
        exportProject: () => exportProject(documentModel)
    };
}
