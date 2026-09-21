export class ToolManager {
    constructor(editor) {
        this.editor = editor;
        this.activeTool = null;
    }

    activate(toolName) {
        this.activeTool = toolName;
        return toolName;
    }
}
