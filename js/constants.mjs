export default Object.freeze({
    ID: "jenny-universal-configurator",
    NAME: "jenny's universal foundry configurator",
    DOCUMENT_SINGLETONS: ["world"],
    DOCUMENT_COLLECTIONS: ["folders"],
    CODE_MIRROR_SETTINGS: {
        mode: {name: "javascript", json: true},
        ...(CodeMirror?.userSettings || {}),
        lineNumbers: true,
        inputStyle: "contenteditable",
        autofocus: false,
        viewportMargin: Infinity
    }
})