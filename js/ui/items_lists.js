import { ClassFlag, EquipSlot } from "../enums.js";

var items_dict = new Map();
var selected_eq_slot;
const ITEM_ICONS_PATH = "/imgs/icons";

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
    img_node.src = `${ITEM_ICONS_PATH}/${item.icon_id}.png`;
    img_node.title = item.name;
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

    // Get the img node of the weared item on top of the eq slot
    const weared_item_img = document.querySelector(`.weared-item[eqslot="${selected_eq_slot}"]`);

    // Set error handler and set the img
    weared_item_img.onerror = () => weared_item_img.src = `${ITEM_ICONS_PATH}/0.png`;
    weared_item_img.setAttribute("src", `${ITEM_ICONS_PATH}/${item.icon_id}.png`)
}

function initCharacterSlotCallbacks(items) {
    const table = document.getElementById("character-config-table");

    for (let i = 0; i < table.rows.length; ++i) {
        const row = table.rows[i];

        for (let j = 0; j < row.cells.length; ++j) {
            const cell = row.cells[j];
            const weared_item_img = cell.children[1];

            weared_item_img.onclick = characterSlotClickCallback;
        }
    }
}

function characterSlotClickCallback(event) {
    const eq_slot = this.getAttribute("eqslot");
    const selected_class = getSelectedClass();
    const item_dropdown = document.getElementById("item-dropdown");
    let item_filter;

    selected_eq_slot = eq_slot;


    // Filter items based on eq slot and selected class
    // First the specific cases of each class
    if (eq_slot == EquipSlot.MAIN_WEAPON) {
        const CLASS_TO_ITEM_TYPE = {
            2: {inv_tab: 0, item_type: 0, item_subtype: 1},
            4: {inv_tab: 0, item_type: 0, item_subtype: 6},
            8: {inv_tab: 0, item_type: 0, item_subtype: 9},
            16: {inv_tab: 0, item_type: 0, item_subtype: 4},
        }

        item_filter = CLASS_TO_ITEM_TYPE[selected_class];
    }
    else if (eq_slot == EquipSlot.SECONDARY_WEAPON) {
        const CLASS_TO_ITEM_TYPE = {
            2: {inv_tab: 0, item_type: 0, item_subtype: 5},
            4: {inv_tab: 0, item_type: 0, item_subtype: 3},
            8: {inv_tab: 0, item_type: 0, item_subtype: 8},
            16: {inv_tab: 0, item_type: 0, item_subtype: 11},
        }

        item_filter = CLASS_TO_ITEM_TYPE[selected_class];
    }
    else if (eq_slot == EquipSlot.ARMOR) {
        const CLASS_TO_ITEM_TYPE = {
            2: {inv_tab: 0, item_type: 1, item_subtype: 3},
            4: {inv_tab: 0, item_type: 1, item_subtype: 2},
            8: {inv_tab: 0, item_type: 1, item_subtype: 1},
            16: {inv_tab: 0, item_type: 1, item_subtype: 5},
        }

        item_filter = CLASS_TO_ITEM_TYPE[selected_class];
    }
    else {
        // General case
        const EQ_SLOT_TO_ITEM_TYPE = {
            2: {inv_tab: 0, item_type: 2, item_subtype: 0},  // Hat
            3: {inv_tab: 0, item_type: 2, item_subtype: 2},  // Gloves
            4: {inv_tab: 0, item_type: 2, item_subtype: 3},  // Boots
            6: {inv_tab: 0, item_type: 3, item_subtype: 0},  // Necklace
            7: {inv_tab: 0, item_type: 3, item_subtype: 1},  // Ring
            8: {inv_tab: 0, item_type: 3, item_subtype: 2},  // Bracelet
            9: {inv_tab: 0, item_type: 2, item_subtype: 1},  // Mask
            10: {inv_tab: 0, item_type: 3, item_subtype: 3}, // Fairy
            11: {inv_tab: 0, item_type: 3, item_subtype: 4}, // Amulet
            12: {inv_tab: 0, item_type: 4, item_subtype: 1}, // SP
            13: {inv_tab: 0, item_type: 2, item_subtype: 4}, // Body costume
            14: {inv_tab: 0, item_type: 2, item_subtype: 5}, // Hat costume
            15: {inv_tab: 0, item_type: 2, item_subtype: 6}, // Weapon costume
            16: {inv_tab: 0, item_type: 2, item_subtype: 7}, // Wings costume
            17: {inv_tab: 0, item_type: 3, item_subtype: 5}, // Minipet
        }

        item_filter = EQ_SLOT_TO_ITEM_TYPE[eq_slot];
    }


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

function itemPassFilter(item, filter, required_class, eq_slot) {
    return item.eq_slot == eq_slot && 
        item.inventory_tab == filter.inv_tab &&
        item.item_type == filter.item_type &&
        item.item_subtype == filter.item_subtype &&
        item.is_limited == 0 &&
        (item.required_class & required_class || item.required_class == 0);
}

function getSelectedClass() {
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