import { character_config } from "../calculator/character_config.js";
import { AccessorySubType, ArmorSubType, ClassFlag, EquipmentSubType, EquipSlot, InventoryTab, ItemType, SpecialistSubType, WeaponSubType } from "../enums.js";
import { displayEquippedOrangeBuffs } from "./buff_widget.js";
import { hideFairyInspector } from "./fairy_inspector.js";
import { resetSkill } from "./skill_list.js";
import { hideSpInspector } from "./sp_inspector.js";
import { hideWeaponInspector } from "./weapon_inspector.js";

var items_dict = new Map();
var selected_eq_slot;
export const ITEM_ICONS_PATH = "imgs/icons";

export function initItemListUI(items) {
    init(items);
    initCharacterSlotCallbacks(items);

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".weared-item")) {
            hideDropdown();
        }
    });
}

function init(items) {
    const item_dropdown = document.getElementById("item-dropdown");

    items.forEach(item => {
        if (item.name == undefined)
            return;

        createItemUIandAddToDropdown(item, item_dropdown);
        items_dict.set(item.vnum, item);
    });
}


function createItemUIandAddToDropdown(item, dropdown) {
    const img_container = document.createElement("div");
    img_container.classList.add("item-img-container");
    img_container.classList.add("clickable");
    img_container.onclick = onItemClicked;

    const img_node = document.createElement("img");
    img_node.loading = "lazy";
    img_node.src = `${ITEM_ICONS_PATH}/${item.icon_id}.png`;
    img_node.onerror = () => img_node.src = `${ITEM_ICONS_PATH}/0.png`;
    img_node.setAttribute("vnum", item.vnum);

    img_container.appendChild(img_node);

    dropdown.appendChild(img_container);
}

function onItemClicked(event) {
    // Get the img node from the dropdown menu
    const img_node = this.children[0];

    // Get the vnum of the item
    const vnum = parseInt(img_node.getAttribute("vnum"));

    // Get the itemdata
    const item = items_dict.get(vnum);

    console.log(item);

    // Get the img node of the weared item on top of the eq slot
    const weared_item_img = document.querySelector(`.weared-item[eqslot="${selected_eq_slot}"]`);

    // Set error handler and set the img
    weared_item_img.onerror = () => weared_item_img.src = `${ITEM_ICONS_PATH}/0.png`;
    weared_item_img.setAttribute("src", `${ITEM_ICONS_PATH}/${item.icon_id}.png`)
    weared_item_img.setAttribute("title", img_node.getAttribute("title"));

    // Set the item data in the charcter config structure
    const eqslot = parseInt(weared_item_img.getAttribute("eqslot"));
    character_config.setItem(eqslot, item);

    // If we click an SP reset the skill widget
    if (eqslot == EquipSlot.SP)
        resetSkill();

    // TEST
    displayEquippedOrangeBuffs();
}

function initCharacterSlotCallbacks(items) {
    const table = document.getElementById("character-config-table");

    for (let i = 0; i < table.rows.length; ++i) {
        const row = table.rows[i];

        for (let j = 0; j < row.cells.length; ++j) {
            const cell = row.cells[j];
            const weared_item_img = cell.children[1];
            const eqslot = parseInt(weared_item_img.getAttribute("eqslot"));

            weared_item_img.addEventListener("click", characterSlotClickCallback);

            if (eqslot == EquipSlot.MAIN_WEAPON || eqslot == EquipSlot.SECONDARY_WEAPON)
                weared_item_img.addEventListener("click", hideWeaponInspector);

            if (eqslot == EquipSlot.SP)
                weared_item_img.addEventListener("click", hideSpInspector);

            if (eqslot == EquipSlot.FAIRY) {
                weared_item_img.addEventListener("click", hideFairyInspector);
            }
        }
    }
}

function characterSlotClickCallback(event) {
    const eq_slot = this.getAttribute("eqslot");
    const selected_class = getSelectedClass();
    const item_dropdown = document.getElementById("item-dropdown");
    let item_filter = getItemFilter(eq_slot, selected_class);

    selected_eq_slot = eq_slot;


    // Filter the items
    for (let i = 0; i < item_dropdown.children.length; ++i) {
        const img_container = item_dropdown.children[i];
        const img_node = img_container.firstChild;
        const vnum = parseInt(img_node.getAttribute("vnum"));
        const item = items_dict.get(vnum);

        if (item != undefined) {

            if (itemPassFilter(item, item_filter, selected_class, eq_slot)) {
                img_container.style.display = "flex";
            }
            else {
                img_container.style.display = "none";
            }
            
        }
        else {
            img_container.style.display = "none";
        }
    }

    // Move the item dropdown to where the cursor is
    item_dropdown.style.left = event.pageX.toString() + "px";
    item_dropdown.style.top = event.pageY.toString() + "px";

    showDropdown();
}

function getItemFilter(eq_slot, selected_class) {
    // Filter items based on eq slot and selected class
    // First the specific cases of each class
    if (eq_slot == EquipSlot.MAIN_WEAPON) {
        const CLASS_TO_ITEM_TYPE = {
            1: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.WEAPON, item_subtype: WeaponSubType.ADV_SWORD},
            2: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.WEAPON, item_subtype: WeaponSubType.SWORD},
            4: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.WEAPON, item_subtype: WeaponSubType.BOW},
            8: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.WEAPON, item_subtype: WeaponSubType.WAND},
            16: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.WEAPON, item_subtype: WeaponSubType.FIST},
        }

        return CLASS_TO_ITEM_TYPE[selected_class];
    }
    else if (eq_slot == EquipSlot.SECONDARY_WEAPON) {
        const CLASS_TO_ITEM_TYPE = {
            1: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.WEAPON, item_subtype: WeaponSubType.SLINGSHOT},
            2: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.WEAPON, item_subtype: WeaponSubType.SLINGSHOT},
            4: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.WEAPON, item_subtype: WeaponSubType.DAGGER},
            8: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.WEAPON, item_subtype: WeaponSubType.SPELLGUN},
            16: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.WEAPON, item_subtype: WeaponSubType.TOKEN},
        }

        return CLASS_TO_ITEM_TYPE[selected_class];
    }
    else if (eq_slot == EquipSlot.ARMOR) {
        const CLASS_TO_ITEM_TYPE = {
            1: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.ARMOR, item_subtype: ArmorSubType.ADVENTURER},
            2: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.ARMOR, item_subtype: ArmorSubType.SWORDSMAN},
            4: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.ARMOR, item_subtype: ArmorSubType.ARCHER},
            8: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.ARMOR, item_subtype: ArmorSubType.MAGE},
            16: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.ARMOR, item_subtype: ArmorSubType.MARTIAL},
        }

        return CLASS_TO_ITEM_TYPE[selected_class];
    }
    // Special case for sps
    else if (eq_slot == EquipSlot.SP) {
        if (selected_class == ClassFlag.ADVENTURER) {
            return {inv_tab: InventoryTab.EQUIP, item_type: ItemType.SPECIALIST, item_subtype: SpecialistSubType.EVENT_SP};
        }
        else {
            return {inv_tab: InventoryTab.EQUIP, item_type: ItemType.SPECIALIST, item_subtype: SpecialistSubType.CLASS_SP};
        }
    }
    else {
        // General case
        const EQ_SLOT_TO_ITEM_TYPE = {
            2: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.EQUIPMENT, item_subtype: EquipmentSubType.HAT},
            3: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.EQUIPMENT, item_subtype: EquipmentSubType.GLOVES},
            4: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.EQUIPMENT, item_subtype: EquipmentSubType.BOOTS},
            6: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.ACCESSORY, item_subtype: AccessorySubType.NECKLACE},
            7: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.ACCESSORY, item_subtype: AccessorySubType.RING},
            8: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.ACCESSORY, item_subtype: AccessorySubType.BRACELET},
            9: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.EQUIPMENT, item_subtype: EquipmentSubType.MASK},
            10: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.ACCESSORY, item_subtype: AccessorySubType.FAIRY},
            11: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.ACCESSORY, item_subtype: AccessorySubType.AMULET},
            12: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.SPECIALIST, item_subtype: SpecialistSubType.CLASS_SP},
            13: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.EQUIPMENT, item_subtype: EquipmentSubType.COSTUME},
            14: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.EQUIPMENT, item_subtype: EquipmentSubType.COSTUME_HAT},
            15: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.EQUIPMENT, item_subtype: EquipmentSubType.COSTUME_WEAPON},
            16: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.EQUIPMENT, item_subtype: EquipmentSubType.COSTUME_WINGS},
            17: {inv_tab: InventoryTab.EQUIP, item_type: ItemType.ACCESSORY, item_subtype: AccessorySubType.MINI_PET},
        }

        return EQ_SLOT_TO_ITEM_TYPE[eq_slot];
    }
}

function itemPassFilter(item, filter, required_class, eq_slot) {
    let filtered = true;
    filtered &&= item.eq_slot == eq_slot;
    filtered &&= item.inventory_tab == filter.inv_tab;
    filtered &&= item.item_type == filter.item_type;
    filtered &&= item.item_subtype == filter.item_subtype;
    filtered &&= item.is_limited == 0

    // Check if the slot is one that must have a required class option
    const required_class_slots = [
        EquipSlot.MASK, 
        EquipSlot.HAT, 
        EquipSlot.MAIN_WEAPON, 
        EquipSlot.SECONDARY_WEAPON,
        EquipSlot.ARMOR,
        EquipSlot.HAT_COSTUME,
        EquipSlot.BODY_COSTUME,
        EquipSlot.WEAPON_COSTUME,
        EquipSlot.WINGS_COSTUME
    ]

    if (required_class_slots.includes(parseInt(eq_slot))) {
        filtered &&= item.required_class & required_class;
    }
    else {
        filtered &&= (item.required_class & required_class || item.required_class == 0);
    }

    return filtered;
}

export function getSelectedClass() {
    const melee_radio_btn = document.getElementById("melee-radio-btn");
    const ranged_radio_btn = document.getElementById("ranged-radio-btn");
    const mage_radio_btn = document.getElementById("mage-radio-btn");
    const martial_artist_radio_btn = document.getElementById("artist-radio-btn");
    

    if (melee_radio_btn.checked) {
        return ClassFlag.SWORDSMAN;
    }

    if (ranged_radio_btn.checked) {
        return ClassFlag.ARCHER;
    }

    if (mage_radio_btn.checked) {
        return ClassFlag.MAGE;
    }

    if (martial_artist_radio_btn.checked) {
        return ClassFlag.MARTIAL_ARTIST;
    }

    return ClassFlag.ADVENTURER;
}

function showDropdown() {
    const item_dropdown = document.getElementById("item-dropdown");
    item_dropdown.style.visibility = "visible";
    item_dropdown.style.opacity = 1;
}

function hideDropdown() {
    const item_dropdown = document.getElementById("item-dropdown");

    if (item_dropdown.style.visibility != "hidden" && item_dropdown.style.opacity != 0) {
        item_dropdown.style.opacity = 0;
        item_dropdown.style.visibility = "hidden";
    }
}