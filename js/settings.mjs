import J from "./constants.mjs"
import { strategies } from "./patcher.mjs"

class JUCSettingsForm extends FormApplication {
    static get defaultOptions() {
        return {...super.defaultOptions, ...{
            title: J.NAME,
            id: 'juc-configurator',
            template: `modules/${J.ID}/templates/universal-configurator.html`,
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
        juc_overloads.innerText = ""
        for (const overload of this.getData()) {
            const overloadElement = document.createElement("div")
            overloadElement.innerHTML = this.renderJUCOverload(overload)
            juc_overloads.appendChild(overloadElement)
            this._onChangeInput({originalEvent: {target: overloadElement.firstElementChild.firstElementChild}})
        }
        const editors = []
        if (typeof CodeMirror !== "undefined") {
            for (const textarea of juc_overloads.querySelectorAll("textarea")) {
                editors.push(CodeMirror.fromTextArea(textarea, J.CODE_MIRROR_SETTINGS))
            }
        }
        document.getElementById("juc_add_overload").addEventListener("click", () => {
            const overloadElement = document.createElement("div")
            overloadElement.innerHTML = this.renderJUCOverload({keyPath: "", type: "object", items: []})
            juc_overloads.appendChild(overloadElement)
        })
        document.getElementById("juc_save").addEventListener("click", async () => {
            ui.notifications.info(`${J.NAME}: saving overloads...`)
            for (const editor of editors) {
                editor.save()
            }
            await game.settings.set(J.ID, "overloads", Array.from(juc_overloads.querySelectorAll("fieldset")).map((overload_element) => ({
                keyPath: overload_element.querySelector(".key-path").value,
                type: overload_element.querySelector("input.juc-overload-type:checked").value,
                hook: overload_element.querySelector("input.juc-hook").value,
                items: Array.from(overload_element.querySelectorAll("table tbody tr:nth-child(2n-1)")).map(
                    (item_row, idx) => ({
                        key: overload_element.querySelector("input.juc-overload-type:checked").value === "object"
                        ? item_row.querySelector(".juc-key").value : idx,
                        type: item_row.querySelector(".juc-type").value,
                        strategy: item_row.querySelector(".juc-strategy").value,
                        value: item_row.nextElementSibling.querySelector("textarea").value
                    })
                ),
                reset: Array.from(overload_element.querySelectorAll("input.juc-doc-reset:checked")).map((element) => element.value)
            })))
            ui.notifications.info(`${J.NAME}: overloads saved. reload to patch.`)
            this.close()
        })
        juc_overloads.addEventListener("click", (event) => {
            if (event.target.classList.contains("juc-add-item")) {
                const tempElement = document.createElement("table")
                tempElement.innerHTML = this.renderJUCOverloadItem({key: "", type: "object", strategy: "default", value: "{}"})
                if (typeof CodeMirror !== "undefined") {
                    editors.push(CodeMirror.fromTextArea(tempElement.querySelector("textarea"), J.CODE_MIRROR_SETTINGS))
                }
                for (const row of tempElement.querySelectorAll("tr")) {
                    event.target.parentNode.querySelector("tbody").appendChild(row)
                }
            } else if (event.target.classList.contains("juc-delete-patch")) {
                const row1 = event.target.parentNode.parentNode
                const row2 = row1.nextElementSibling
                row1.parentNode.removeChild(row1)
                row2.parentNode.removeChild(row2)
            } else if (event.target.classList.contains("juc-delete-overload")) {
                juc_overloads.removeChild(event.target.parentNode.parentNode)
            }
        })
    }
    async _onChangeInput(event) {
        if (event.originalEvent.target.classList.contains("juc-overload-type")) {
            const keyColumnCells = event.originalEvent.target.parentNode.parentNode.querySelectorAll("table tr > :nth-last-child(3)")
            for (const cell of keyColumnCells) {
                cell.style.display = event.originalEvent.target.value === "array" ? "none" : ""
            }
        } else if (event.originalEvent.target.classList.contains("juc-type")) {
            event.originalEvent.target.parentNode.nextElementSibling.innerHTML = this.renderStrategyDropdown(event.originalEvent.target.value, "default")
        }
    }
    async _updateObject() {
        return true
    }
    renderStrategyDropdown(type, selectedStrategy) {
        return `<select name=strategy class=juc-strategy>
            ${Object.keys(strategies[type]).map(
                (strategy) =>
                    `<option ${strategy === selectedStrategy ? "selected" : ""} name="${strategy}" value="${strategy}">${strategy}</option>`
            ).join("")}
        </select>`
    }
    renderJUCOverloadItem({key, type, strategy, value}) {
        return `<tr>
            <td><input type=text name=key class=juc-key placeholder="key" value="${key}"></td>
            <td><select name=type class=juc-type>
                ${Object.keys(strategies).map(
                    (strategyType, i) =>
                        `<option ${type === strategyType ? "selected" : ""} name="${strategyType}" value="${strategyType}">${strategyType}</option>`
                ).join("")}
            </select></td>
            <td>${this.renderStrategyDropdown(type, strategy)}</td>
            <td><button class=juc-delete-patch>Delete</button></td>
        </tr>
        <tr><td colspan=4><label class=label>json value<textarea>${value}</textarea></td></tr>`
    }
    renderJUCOverload({keyPath, hook, type, items, reset}) {
        const columns = `<th>key</th><th>type</th><th>patching strategy</th><th>actions</th>`
        const random_id = Math.random() * Number.MAX_SAFE_INTEGER&0x7FFF_FFFF
        return `<fieldset><legend>overload set</legend>
            <div><label class=label>key path<br><input type=text name=key-path class=key-path placeholder="example: CONFIG.DND5E.damageTypes" value="${keyPath ?? ""}"></label></div>
            <br>
            <div><b>overload type</b></div>
            <label class=label><input class=juc-overload-type type=radio name="overload-type-${random_id}" value=object ${type === "object" ? "checked": ""}> object</label>
            <br>
            <label class=label><input class=juc-overload-type type=radio name="overload-type-${random_id}" value=array ${type === "array" ? "checked": ""}> array</label>
            <br><br>
            <label class=label>defer until hook <input class=juc-hook type=text name=hook value="${hook ?? ""}" placeholder="leave blank to not defer"></label>
            <br><br>
            <div><b>reset document types</b></div>
            <div>you probably want to select any document types you affect with this overload</div>
            ${[...game.collections.keys(), ...J.DOCUMENT_SINGLETONS, ...J.DOCUMENT_COLLECTIONS].map((documentType) =>
                `<label class=label><input class=juc-doc-reset type=checkbox name="overload-reset-${random_id}" value=${documentType} ${reset?.includes(documentType) ? "checked" : ""}> ${documentType}</label>`
            ).join("<br>")}
            <table>
                <caption>items to patch</caption>
                <thead><tr>${columns}</tr></thead>
                <tbody>
                    ${items.map(this.renderJUCOverloadItem.bind(this)).join("")}
                </tbody>
                <tfoot><tr>${columns}</tr></tfoot>
            </table>
            <button class=juc-add-item>add patch</button><button class=juc-delete-overload>delete overload</button>
        </fieldset>`
    }
}

export default JUCSettingsForm