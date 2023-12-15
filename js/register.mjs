import J from "./constants.mjs"
import JUCSettingsForm from "./settings.mjs"
import JUCImportExportForm from "./import-export.mjs"
import applyConfiguration from "./applyConfiguration.mjs"

console.log("jenny's universal configurator - pre-init")

Hooks.once("init", () => {

console.log("jenny's universal configurator: registering settings in init hook")

game.settings.registerMenu(J.ID, "overloadsMenu", {
    name: "configurator (breaks things)",
    label: "i understand, let's break things",
    hint: `this has the ability to REALLY break things. you should probably test out this module in a disposable world so you understand how it works before putting it in your game.`,
    icon: "fas fa-gears",
    type: JUCSettingsForm,
    scope: "world",
    restricted: true
})

game.settings.registerMenu(J.ID, "importExportMenu", {
    name: "import/export json overloads",
    label: "open json editor",
    hint: "you can copy json from the editor, or paste it in then import it",
    icon: "fas fa-file-export",
    type: JUCImportExportForm,
    scope: "world",
    restricted: true
})

game.settings.register(J.ID, "overloads", {
    name: `${J.NAME} overloads`,
	hint: "this is managed by the module's apps",
    scope: "world",
    config: false,
	requiresReload: true,
    type: Array,
    default: []
})

console.log(`jenny's universal configurator - processing patches`)

for (const {hook, keyPath, func} of applyConfiguration()) {
    if (hook) {
        console.log(`jenny's universal configurator - deferred patching ${keyPath} until ${hook} hook`)
        Hooks.once(hook, func)
    } else {
        console.log(`jenny's universal configurator - patching ${keyPath} during init hook`)
        func()
    }
}
})