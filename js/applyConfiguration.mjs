import J from "./constants.mjs"
import patch from "./patcher.mjs"

export default () => game.settings.get(J.ID, "overloads").map((overload) => ({...overload, func: () => {
    console.log(`jenny's universal configurator: patching ${overload.keyPath}`)
    const keyPath = overload.keyPath.split(".").map((v) => isNaN(parseInt(v)) ? v : parseInt(v))
    const obj = keyPath.reduce((currentObject, key, idx) => {
        if (typeof currentObject[key] === "undefined") {
            if (idx + 1 === keyPath.length) {
                if (overload.type === "object") {
                    currentObject[key] = {}
                } else if (overload.type === "array") {
                    currentObject[key] = []
                }
            }
            if (typeof keyPath[idx + 1] === "number") {
                currentObject[key] = []
            } else if (typeof keyPath[idx + 1] === "string") {
                currentObject[key] = {}
            }
        }
        return currentObject[key]
    }, globalThis)
    if (overload.type === "function") {
        obj.call(...overload.items.map((v) => JSON.parse(v.value)))
    }
    for (const {key, type, strategy, value} of overload.items) {
        if (type === "other" && strategy === "delete") {
            console.log(`delete ${overload.keyPath}[${key}]`)
            delete obj[key]
            continue
        }
        const patchValue = patch(obj, type, strategy, key, JSON.parse(value))
        console.log(patchValue)
        if (overload.type === "object") {
            obj[key] = patchValue
        } else if (overload.type === "array") {
            obj.push(patchValue)
        }
    }
    if (Array.isArray(overload.reset)) {
        console.log(`jenny's universal configurator: processing resets for ${overload.keyPath} on [${overload.reset.join(", ")}]`)
        for (const docType of game.collections.keys()) {
            if (overload.reset.includes(docType)) {
                for (const doc of game.collections.get(docType)) {
                    doc.reset()
                }
            }
        }
        for (const docCollection of J.DOCUMENT_COLLECTIONS) {
            if (overload.reset.includes(docCollection)) {
                for (const doc of game[docCollection]) {
                    doc.reset()
                }
            }
        }
        for (const docSingleton of J.DOCUMENT_SINGLETONS) {
            if (overload.reset.includes(docSingleton)) {
                game[docSingleton].reset()
            }
        }
    }
}}))