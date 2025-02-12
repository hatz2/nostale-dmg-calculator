import { getIdleMonsterImgPaths } from "./utils.js";
import { initMonsterListUI } from "./ui/monster_list.js";
import { initItemListUI } from "./ui/items_lists.js";
import { initWeaponInspector } from "./ui/weapon_inspector.js";
import { initDraggableElements } from "./ui/dragable_element.js";
import { initSpInspector } from "./ui/sp_inspector.js";
import { initClassSwapRadioButtons } from "./ui/class_swap.js";
import { initFairyInspector } from "./ui/fairy_inspector.js";
import { initSkillListUI } from "./ui/skill_list.js";
import { initBuffsWidget } from "./ui/buff_widget.js";
import { initStatsTab } from "./ui/stats_tab.js";
import { initDmgWidget } from "./ui/dmg_widget.js";

var monsters;
var monster_sprite_data;
var monster_img_paths;
var items;
var bcards;
var skills;

window.addEventListener("load", onLoad);

async function onLoad() {
    // Load and parse game files
    monsters = await fetch("/data/monster.json");
    monsters = await monsters.json();

    items = await fetch("/data/item.json");
    items = await items.json();

    bcards = await fetch("/data/bcard.json");
    bcards = await bcards.json();

    skills = await fetch("/data/skill.json");
    skills = await skills.json();
    
    // console.log(bcards);
    // console.log(items);
    //console.log(skills);

    const monster_sprite_file = await fetch("/client_files/NSmnData.NOS.json");
    monster_sprite_data = await monster_sprite_file.json();
    monster_img_paths = getIdleMonsterImgPaths(monster_sprite_data);

    initMonsterListUI(monsters, monster_img_paths);
    initItemListUI(items);
    initSkillListUI(skills);
    initWeaponInspector(bcards);
    initSpInspector();
    initFairyInspector(bcards);
    initDraggableElements();
    initClassSwapRadioButtons();
    initBuffsWidget(bcards);
    initStatsTab();
    initDmgWidget(monsters);
}
