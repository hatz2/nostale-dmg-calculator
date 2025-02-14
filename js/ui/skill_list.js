import { character_config } from "../calculator/character_config.js";
import { SkillTargetGroup, SkillType } from "../enums.js";
import { displayEquippedOrangeBuffs } from "./buff_widget.js";
import { getSelectedClass, ITEM_ICONS_PATH } from "./items_lists.js";

var skills
var skills_dict;

export function initSkillListUI(skill_list) {
    skills = skill_list;
    skills_dict = new Map();

    initSkillDict(skills);
    initCharacterSlot();
    initDropdownSkills();

    document.addEventListener("click", (event) => {
        if (!event.target.closest("#equiped-skill")) {
            hideSkillDropdown();
        }
    });
}

function initSkillDict(skills) {
    skills.forEach(skill => {
        skills_dict.set(skill.vnum, skill);
    });
}

function initCharacterSlot() {
    const slot_img = document.getElementById("equiped-skill");
    slot_img.addEventListener("click", onSkillSlotClicked);
}

function onSkillSlotClicked(event) {
    const dropdown = document.getElementById("skill-dropdown");
    const selected_class = getSelectedClass();

    // Filter the skills
    for (let i = 0; i < dropdown.children.length; ++i) {
        const img_container = dropdown.children[i];
        const img_node = img_container.firstChild;
        const vnum = parseInt(img_node.getAttribute("vnum"));
        const skill = skills_dict.get(vnum);

        if (skill == undefined) {
            img_container.style.display = "none";
            continue;
        }

        let selected_class = undefined;

        // If character has no SP equipped
        if (character_config.sp == undefined) {
            // TODO: do correct thing here
            const CLASS_FLAG_TO_SKILL_CLASS = {
                1: 0,
                2: 1,
                4: 2,
                8: 3,
                16: 4,
            }
            selected_class = CLASS_FLAG_TO_SKILL_CLASS[getSelectedClass()];
        }
        else {
            const MORPH_ID_TO_SKILL_CLASS = {
                1: 32,
                2: 33,
                3: 34,
                4: 35,
                5: 36,
                6: 37,
                7: 38,
                8: 39,
                9: 40,
                10: 41,
                11: 42,
                12: 43,
                13: 44,
                14: 45,
                15: 46,
                16: 47,
                17: 48,
                18: 49,
                19: 50,
                20: 51,
                21: 52,
                22: 53,
                23: 54,
                24: 55,
                25: 56,
                26: 57,
                27: 58,
                28: 59,
                29: 60,
                30: 60, // haetae transform
                31: 61,
                32: 62,
                33: 63,
                34: 64,
                35: 65, // angler
                36: 65, // angler skin
                37: 66, // chef
                38: 66, // chef skin 
                39: 67,
                40: 68,
                41: 69,
                42: 70,
                43: 71, // flame druid transform // TODO: do something to display this skills aswell?
                44: 0, // no SP?
                45: 72,
                46: 73,
                47: 74,
                48: 75,
                49: 76, // trainer
                50: 76, // trainer skin
                51: 77,
                52: 78,
                53: 79,
                54: 80,
            }
            selected_class = MORPH_ID_TO_SKILL_CLASS[character_config.sp.visual_change_id];
        }

        if (skillPassFilter(skill, selected_class)) {
            img_container.style.display = "flex";
        }
        else {
            img_container.style.display = "none";
        }
    }

    // Set position to cursor
    dropdown.style.left = event.pageX.toString() + "px";
    dropdown.style.top = event.pageY.toString() + "px";

    showDropdown();
}

function skillPassFilter(skill, selected_class) {
    return skill.type == SkillType.PLAYER_SKILL &&
            skill.class == selected_class &&
            skill.target_group == SkillTargetGroup.ENEMY;
}

function showDropdown() {
    const dropdown = document.getElementById("skill-dropdown");
    dropdown.style.visibility = "visible";
    dropdown.style.opacity = 1;
}

export function hideSkillDropdown() {
    const dropdown = document.getElementById("skill-dropdown");
    dropdown.style.visibility = "hidden";
    dropdown.style.opacity = 0;
}

// TODO: Refactor (duplicated code from item list UI)
function initDropdownSkills() {
    const dropdown = document.getElementById("skill-dropdown");

    skills.forEach(skill => {
        const img_container = document.createElement("div");
        img_container.classList.add("item-img-container");
        img_container.classList.add("clickable");
        img_container.onclick = onSkillClicked;

        const img_node = document.createElement("img");
        img_node.loading = "lazy";
        img_node.src = `${ITEM_ICONS_PATH}/${skill.icon_id}.png`;
        img_node.title = skill.name;
        img_node.onerror = () => img_node.src = `${ITEM_ICONS_PATH}/0.png`;
        img_node.setAttribute("vnum", skill.vnum);

        img_container.appendChild(img_node);

        dropdown.appendChild(img_container);
    });
}

function onSkillClicked(event) {
    const img_node = this.children[0];
    const vnum = parseInt(img_node.getAttribute("vnum"));
    const skill = skills_dict.get(vnum);

    console.log(skill);


    const weared_item_img = document.getElementById("equiped-skill");

    // Set error handler and set the img
    weared_item_img.setAttribute("loading", "lazy");
    weared_item_img.onerror = () => weared_item_img.src = `${ITEM_ICONS_PATH}/0.png`;
    weared_item_img.setAttribute("src", `${ITEM_ICONS_PATH}/${skill.icon_id}.png`)
    weared_item_img.setAttribute("title", img_node.getAttribute("title"));

    // Set the item data in the charcter config structure
    character_config.skill = skill;

    displayEquippedOrangeBuffs();
}

export function resetSkill() {
    const img = document.getElementById("equiped-skill");
    img.setAttribute("src", `imgs/ui/char_slot_placeholder.png`);
    img.setAttribute("title", "");
    character_config.skill = undefined;
}