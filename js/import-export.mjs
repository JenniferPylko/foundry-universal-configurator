import J from "./constants.mjs"

class JUCImportExportForm extends FormApplication {
    static get defaultOptions() {
        return {...super.defaultOptions, ...{
            title: J.NAME,
            id: 'juc-import-export',
            template: `modules/${J.ID}/templates/import-export.html`,
            width: 700,
            height: 600,
            closeOnSubmit: false
        }}
    }
    getData() {
        return game.settings.get(J.ID, "overloads")
    }
    activateListeners(html) {
        super.activateListeners(html)
        juc_import_export.value = JSON.stringify(this.getData())
        const editors = []
        if (typeof CodeMirror !== "undefined") {
            editors.push(CodeMirror.fromTextArea(juc_import_export, J.CODE_MIRROR_SETTINGS))
        }
        juc_import.addEventListener("click", () => {
            for (const editor of editors) {
                editor.save()
            }
            game.settings.set(J.ID, "overloads", JSON.parse(juc_import_export.value))
            ui.notifications.info(`jenny's universal configurator: imported json overloads. refresh to patch.`)
            this.close()
        })
    }
    async _updateObject() {
        return true
    }
}

export default JUCImportExportForm