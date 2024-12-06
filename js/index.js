import { Monster, MonsterDatParser } from "./dat_parsers/monster_parser.js"
import { AttackType, Resistance } from "./enums.js";
import { NameParser } from "./name_parser.js";
import { getIdleMonsterImgPaths } from "./img_parsers/monster_img_parser.js";
import { Item, ItemDatParser } from "./dat_parsers/item_parser.js";
import { initMonsterList } from "./ui/monster_list.js";

var monsters;
var monster_sprite_data;
var monster_img_paths;
var items;

window.addEventListener("load", onLoad);

async function onLoad() {
    console.log('Loaded');
    
    // Load and parse game files
    const monster_names = await initMonsterNames();
    monsters = await initMonsters(monster_names);
    const item_names = await initItemNames();
    items = await initItems(item_names);

    const monster_sprite_file = await fetch("/data/NSmnData.NOS.json");
    monster_sprite_data = await monster_sprite_file.json();
    monster_img_paths = getIdleMonsterImgPaths(monster_sprite_data);

    initMonsterList(monsters, monster_img_paths);
}

async function initMonsterNames() {
    const monster_lang_file = await fetch("/lang/_code_uk_monster.txt");
    const data = await monster_lang_file.text();
    const parser = new NameParser(data);
    return parser.parse();
}

async function initMonsters(monster_names) {
    const monster_dat_file = await fetch("/data/monster.dat");
    const data = await monster_dat_file.text();
    const parser = new MonsterDatParser(data, monster_names);
    return parser.parse();
}

async function initItemNames() {
    const item_lang_file = await fetch("/lang/_code_uk_Item.txt");
    const data = await item_lang_file.text();
    const parser = new NameParser(data);
    return parser.parse();
}

async function initItems(item_names) {
    const item_dat_file = await fetch("/data/Item.dat");
    const data = await item_dat_file.text();
    const parser = new ItemDatParser(data, item_names);
    return parser.parse();
}