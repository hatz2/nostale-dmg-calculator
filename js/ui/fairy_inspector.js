import { character_config } from "../calculator/character_config.js";
import { formatString } from "../utils.js";
import { ITEM_ICONS_PATH } from "./items_lists.js";

var bcards;

export function initFairyInspector(bcard_list) {
    bcards = bcard_list;

    initCloseBtn();
    initFairyImgContextMenu();
    initInputField();
}

function initCloseBtn() {
    const btn = document.getElementById("fairy-inspector-close-btn");
    btn.addEventListener("click", hideFairyInspector);
}

export function hideFairyInspector() {
    const inspector = document.getElementById("fairy-inspector");
    inspector.style.visibility = "hidden";
    inspector.style.opacity = 0;
}

function initFairyImgContextMenu() {
    const fairy_img = document.querySelector(`.weared-item[eqslot="10"]`);
    fairy_img.addEventListener("contextmenu", fairyContextMenu);
}

function fairyContextMenu(event) {
    event.preventDefault();

    if (character_config.fairy == undefined)
        return;

    showFairyDetails(
        character_config.fairy, 
        {x: event.pageX, y: event.pageY});
}

function showFairyDetails(fairy, pos) {
    const inspector = document.getElementById("fairy-inspector");
    const fairy_name_text = document.getElementById("fairy-name");
    const fairy_element_text = document.getElementById("fairy-element-text");
    const fairy_level = document.getElementById("fairy-level-text");
    const fairy_img = document.getElementById("fairy-img");
    const buff_effects_container = document.getElementById("fairy-buff-effects");

    fairy_name_text.innerText = fairy.name;
    fairy_element_text.innerText = getElementText(fairy.data.element);
    fairy_level.value = fairy.data.level;
    fairy_img.setAttribute("src", `${ITEM_ICONS_PATH}/${fairy.icon_id}.png`)


    // Position the widget where the cursor is
    inspector.style.top = pos.y + "px";
    inspector.style.left = pos.x + "px";

    // Remove orange effect nodes
    while (buff_effects_container.firstChild) {
        buff_effects_container.removeChild(buff_effects_container.lastChild);
    }

    // Show orange buff effects
    fairy.buffs.forEach(buff => {
        if (buff.bcard_vnum <= 0) 
            return;

        let bcard = bcards.filter((elem) => elem.vnum == buff.bcard_vnum)[0];

        const desc = parseInt(bcard.desc[buff.bcard_sub]);
        const values = [Math.abs(buff.values[0]), Math.abs(buff.values[1])];

        // TODO: Add other desc types (buffs for example)
        // TODO: Code refactor (duplication)
        if (desc == 5) {
            const race_id = values[0].toString();
            const RACE_TO_TEXT = {
                "00": "Low-level plant",
                "01": "Low-level animal",
                "02": "Low-level monster",
                "10": "High-level plant",
                "11": "High-level animal",
                "12": "High-level monster",
                "20": "Kovolt",
                "21": "Bushtais",
                "22": "Catsy",
                "30": "Human",
                "32": "Neutral",
                "33": "Demon",
                "40": "Angel",
                "50": "Low-level undead",
                "51": "High-level undead",
                "60": "Low-level spirit",
            }

            // Set value to the text equivalent
            values[0] = RACE_TO_TEXT[race_id];
        }
        
        const node = document.createElement("div");
        node.classList.add("item-inspector-dark-orange-text");
        const text_template = bcard.list[buff.bcard_sub][buff.values[0] >= 0 ? 0 : 1];
        const text = formatString(text_template, values);

        node.innerHTML = text;
        buff_effects_container.appendChild(node);
    });

    // Show the widget
    showFairyInspector();
}

function getElementText(element) {
    const element_to_text = {
        0: "No element",
        1: "Fire",
        2: "Water",
        3: "Light",
        4: "Shadow",
    };

    return element_to_text[element];
}

function showFairyInspector() {
    const inspector = document.getElementById("fairy-inspector");
    inspector.style.visibility = "visible";
    inspector.style.opacity = 1;
}

function initInputField() {
    const input = document.getElementById("fairy-level-text");
    input.addEventListener("input", fairyLevelChanged);
}

function fairyLevelChanged() {
    character_config.fairy.data.level = parseInt(this.value);
}

