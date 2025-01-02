import { character_config } from "../calculator/character_config.js";
import { ClassFlag, EquipSlot } from "../enums.js";
import { formatString } from "../utils.js";
// import { makeDraggable } from "./dragable_element.js";
import { ITEM_ICONS_PATH } from "./items_lists.js";

var bcards
var current_item_slot

export function initWeaponInspector(bcard_list) {
    bcards = bcard_list;

    const weapon_img = document.querySelector(`.weared-item[eqslot="0"]`);
    weapon_img.addEventListener("contextmenu", weaponContextMenu);

    const offhand_img = document.querySelector(`.weared-item[eqslot="5"]`);
    offhand_img.addEventListener("contextmenu", weaponContextMenu);

    const close_btn = document.getElementById("weapon-inspector-close-btn");
    close_btn.addEventListener("click", hideWeaponInspector);

    const weapon_upgrade_input = document.getElementById("weapon-upgrade-lvl");
    weapon_upgrade_input.addEventListener("input", upgradeLevelChange);

    const dmg_min = document.getElementById("dmg-min");
    dmg_min.addEventListener("input", dmgMinChange);

    const dmg_max = document.getElementById("dmg-max");
    dmg_max.addEventListener("input", dmgMaxChange);
}

export function hideWeaponInspector() {
    const weapon_inspector = document.getElementById("main-weapon-inspector");
    weapon_inspector.style.visibility = "hidden";
    weapon_inspector.style.opacity = 0;
}

function weaponContextMenu(event) {
    event.preventDefault();
    current_item_slot = parseInt(this.getAttribute("eqslot"));

    if (character_config.getItem(current_item_slot) == undefined) {
        return;
    }

    showWeaponDetails(
        current_item_slot == EquipSlot.MAIN_WEAPON ? character_config.weapon : character_config.offhand, 
        {x: event.pageX, y: event.pageY});
}

function showWeaponDetails(weapon, pos) {
    // Get HTML elements
    const weapon_inspector = document.getElementById("main-weapon-inspector");
    const weapon_img = document.getElementById("weapon-img");
    const weapon_name_text = document.getElementById("weapon-name");
    const weapon_upgrade_input = document.getElementById("weapon-upgrade-lvl");
    const req_class_text = document.getElementById("req-class-text");
    const req_level_type = document.getElementById("required-lvl-type");
    const weapon_level = document.getElementById("weapon-lvl");
    const dmg_min = document.getElementById("dmg-min");
    const dmg_max = document.getElementById("dmg-max");
    const hit_rate_text = document.getElementById("hit_rate_text");
    const hit_rate = document.getElementById("hit_rate_or_focus");
    const crit_chance = document.getElementById("crit-chance");
    const crit_chance_text = document.getElementById("crit-chance-text");
    const crit_dmg = document.getElementById("crit-dmg");
    const crit_dmg_text = document.getElementById("crit-dmg-text");
    const price = document.getElementById("price");
    const buff_effects_container = document.getElementById("buff-effects");

    // Set HTML elements values
    weapon_img.setAttribute("src", `${ITEM_ICONS_PATH}/${weapon.icon_id}.png`)
    weapon_name_text.innerText = `${weapon.name} +`
    weapon_upgrade_input.value = weapon.data.upgrade_level;
    req_class_text.innerText = getRequiredClassText(weapon.required_class);
    req_level_type.innerText = `Required ${weapon.is_hero_eq ? "Champion" : ""} Level:`
    weapon_level.innerText = `${weapon.data.level}Lv`;
    dmg_min.value = weapon.data.dmg_min;
    dmg_max.value = weapon.data.dmg_max;
    hit_rate.innerText = weapon.data.hit_rate;
    crit_chance.innerText = `${weapon.data.crit_chance}%`;
    crit_chance_text.innerText = "Chance of";
    crit_dmg.innerText = `${weapon.data.crit_damage}%`;
    crit_dmg_text.innerText = "Critical";
    price.innerHTML = new Intl.NumberFormat("de-DE").format(weapon.price);

    // Non crit weapons
    if (weapon.data.crit_damage == 0) {
        hit_rate_text.innerText = "Concentration:";
        crit_chance.style.opacity = 0;
        crit_chance_text.style.opacity = 0;
        crit_dmg.style.opacity = 0;
        crit_dmg_text.style.opacity = 0;
    }
    // Crit weapons
    else {
        hit_rate_text.innerText = "Hit Rate:";
        crit_chance.style.opacity = 1;
        crit_chance_text.style.opacity = 1;
        crit_dmg.style.opacity = 1;
        crit_dmg_text.style.opacity = 1;
    }

    // Remove orange effect nodes
    while (buff_effects_container.firstChild) {
        buff_effects_container.removeChild(buff_effects_container.lastChild);
    }

    // Add orange buff nodes
    weapon.buffs.forEach(buff => {
        if (buff.bcard_vnum <= 0) 
            return;

        let bcard = bcards.filter((elem) => elem.vnum == buff.bcard_vnum)[0];

        const desc = parseInt(bcard.desc[buff.bcard_sub]);
        const values = [Math.abs(buff.values[0]), Math.abs(buff.values[1])];

        // TODO: Add other desc types (buffs for example)
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

    // Move the widget to the cursor position
    weapon_inspector.style.top = pos.y + "px";
    weapon_inspector.style.left = pos.x + "px";

    // Set the widget visible
    weapon_inspector.style.visibility = "visible";
    weapon_inspector.style.opacity = 1;
}

function getRequiredClassText(class_flag) {
    let text = ""

    if (class_flag & ClassFlag.ADVENTURER) {
        if (text.length == 0) {
            text = "Adventurer";
        }
        else {
            text += ", Adventurer";
        }
    }

    if (class_flag & ClassFlag.SWORDSMAN) {
        if (text.length == 0) {
            text = "Swordsman";
        }
        else {
            text += ", Swordsman"
        }
    }

    if (class_flag & ClassFlag.ARCHER) {
        if (text.length == 0) {
            text = "Archer";
        }
        else {
            text += ", Archer";
        }
    }

    if (class_flag & ClassFlag.MAGE) {
        if (text.length == 0) {
            text = "Mage";
        }
        else {
            text += ", Mage";
        }
    }

    if (class_flag & ClassFlag.MARTIAL_ARTIST) {
        if (text.length == 0) {
            text = "Martial Artist";
        }
        else {
            text += ", Martial Artist";
        }
    }

    text += " only";

    return text;
}

function upgradeLevelChange() {
    character_config.getItem(current_item_slot).data.upgrade_level = parseInt(this.value);
}

function dmgMinChange() {
    character_config.getItem(current_item_slot).data.dmg_min = parseInt(this.value);
}

function dmgMaxChange() {
    character_config.getItem(current_item_slot).data.dmg_max = parseInt(this.value);
}