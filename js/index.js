import { MonsterDatParser } from "./parsers/dat/monster_parser.js"
import { NameParser } from "./parsers/name_parser.js";
import { getIdleMonsterImgPaths } from "./parsers/imgs/monster_img_parser.js";
import { ItemDatParser } from "./parsers/dat/item_parser.js";
import { initMonsterListUI } from "./ui/monster_list.js";
import { initItemListUI } from "./ui/items_lists.js";
import { BCardDatParser } from "./parsers/dat/bcard_parser.js";
import { initWeaponInspector } from "./ui/weapon_inspector.js";
import { initDraggableElements } from "./ui/dragable_element.js";
import { initSpInspector } from "./ui/sp_inspector.js";
import { initClassSwapRadioButtons } from "./ui/class_swap.js";
import { initFairyInspector } from "./ui/fairy_inspector.js";
import { SkillDatParser } from "./parsers/dat/skill_parser.js";
import { initSkillListUI } from "./ui/skill_list.js";

var monsters;
var monster_sprite_data;
var monster_img_paths;
var items;
var bcards;
var skills;

window.addEventListener("load", onLoad);

async function onLoad() {
    // Load and parse game files
    const monster_names = await readNamesMapFromFile("/lang/_code_uk_monster.txt");
    const bcard_names = await readNamesMapFromFile("/lang/_code_uk_BCard.txt");
    const card_names = await readNamesMapFromFile("/lang/_code_uk_Card.txt");
    const item_names = await readNamesMapFromFile("/lang/_code_uk_Item.txt");
    const skill_names = await readNamesMapFromFile("/lang/_code_uk_Skill.txt");
    monsters = await initDatObjCollection("/data/monster.dat", monster_names, MonsterDatParser);
    items = await initDatObjCollection("/data/Item.dat", item_names, ItemDatParser);
    bcards = await initDatObjCollection("/data/BCard.dat", bcard_names, BCardDatParser);
    skills = await initDatObjCollection("/data/Skill.dat", skill_names, SkillDatParser)
    
    // console.log(bcards);
    // console.log(items);
    // console.log(skills);

    const monster_sprite_file = await fetch("/data/NSmnData.NOS.json");
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
}

async function readNamesMapFromFile(path) {
    const lang_file = await fetch(path);
    const data = await lang_file.text();
    const parser = new NameParser(data);
    return parser.parse();
}

async function initDatObjCollection(path, names_map, ParserTemplate, ...additional_params) {
    const dat_file = await fetch(path);
    const data = await dat_file.text();
    const parser = new ParserTemplate(data, names_map, additional_params);
    return parser.parse();
}
