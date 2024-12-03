import { Monster, MonsterDatParser, MonsterNameParser } from "./monster_parser.js"
import { AttackType, Resistance } from "./enums.js";
import { getIdleMonsterImgPaths } from "./monster_img_parser.js";

var monsters;
var monster_names;
var monster_sprite_data;
var monster_img_paths;

window.addEventListener("load", onLoad);

async function onLoad() {
    console.log('Loaded');
    
    // Load and parse game files
    monster_names = await initMonsterNames();
    monsters = await initMonsters(monster_names);

    const monster_sprite_file = await fetch("/data/NSmnData.NOS.json");
    monster_sprite_data = await monster_sprite_file.json();
    monster_img_paths = getIdleMonsterImgPaths(monster_sprite_data);

    initMonsterList();

    const monster_search_bar = document.getElementById("monster-search");
    monster_search_bar.addEventListener("input", monsterSearchAutocomplete);
}

async function initMonsterNames() {
    const monster_lang_file = await fetch("/lang/_code_uk_monster.txt");
    const data = await monster_lang_file.text();
    const parser = new MonsterNameParser(data);
    return parser.parse();
}

async function initMonsters(monster_names) {
    const monster_dat_file = await fetch("/data/monster.dat");
    const data = await monster_dat_file.text();
    const parser = new MonsterDatParser(data, monster_names);
    return parser.parse();
}

function monsterSearchAutocomplete() {
    const text = this.value.toLowerCase();

    const monster_list = document.getElementById("monster-list")

    // Iterate over the monster list elements
    const children = monster_list.children;

    for (let i = 0; i < children.length; ++i) {
        const child = children[i];
        const img_node = child.firstChild;
        const monster_name = img_node.title.toLowerCase();

        // Display
        if (monster_name.includes(text)) {
            child.style.display = "flex";
        }
        // Hide
        else {
            child.style.display = "none";
        }
    }
}

function initMonsterList() {
    // Get the list node
    const monster_list = document.getElementById("monster-list");

    // Get the monster selected
    const current_monster = document.getElementById("current-monster");

    const monster_dropdown = document.getElementById("monster-dropdown");

    current_monster.onclick = () => {
        monster_dropdown.style.visibility = "visible";
        monster_dropdown.style.opacity = 1;
    };

    const melee_stat_div = document.getElementById("melee-def-stat");
    const ranged_stat_div = document.getElementById("ranged-def-stat");
    const magic_stat_div = document.getElementById("magic-def-stat");
    const fire_res_div = document.getElementById("fire-res-stat");
    const water_res_div = document.getElementById("water-res-stat");
    const light_res_div = document.getElementById("light-res-stat");
    const shadow_res_div = document.getElementById("shadow-res-stat");
    const monster_name_header = document.getElementById("monster-name-title");
    const defence_level_span = document.getElementById("defence-level-text");
    const monster_element_level_text = document.getElementById("monster-element-level");
    const monster_element_icon = document.getElementById("monster-element-icon");
    const monster_level_span = document.getElementById("monster-level");

    monsters.forEach(monster => {
        // We don't want to track this kind of "mobs"
        if (monster.race === 8)
            return;

        // We don't want to show monsters that has no image
        if (!monster_img_paths.has(monster.skin))
            return;

        // Create the div node
        const div_node = document.createElement("div");
        div_node.setAttribute("class", "clickable monster-img-container");

        // Create the img node
        const img_node = document.createElement("img");
        img_node.setAttribute("src", monster_img_paths.get(monster.skin))
        img_node.setAttribute("title", monster.name);
        img_node.setAttribute("class", "monster-img-max-size");
        img_node.style.margin = "auto";
        img_node.style.padding = "auto";

        // Add the img node to the div
        div_node.appendChild(img_node);

        div_node.onclick = () => {
            // Set the new current monster
            current_monster.title = img_node.title;
            current_monster.src = img_node.src;
            monster_dropdown.style.opacity = 0;

            // Set monster stats
            melee_stat_div.firstChild.data = monster.armor[AttackType.MELEE];
            ranged_stat_div.firstChild.data = monster.armor[AttackType.RANGED];
            magic_stat_div.firstChild.data = monster.armor[AttackType.MAGIC];

            // Set monster element resistances
            fire_res_div.firstChild.data = monster.resistances[Resistance.FIRE] + "%";
            water_res_div.firstChild.data = monster.resistances[Resistance.WATER]+ "%";
            light_res_div.firstChild.data = monster.resistances[Resistance.LIGHT]+ "%";
            shadow_res_div.firstChild.data = monster.resistances[Resistance.SHADOW]+ "%";

            // Set monster name
            monster_name_header.innerText = monster.name;

            // Set armor upgrade
            defence_level_span.innerText = "+" + monster.armor_upgrade;

            // Set monster level
            monster_level_span.innerText = monster.level;

            // Set monster element icon
            monster_element_icon.src = "/imgs/icons/1710" + monster.element + ".png";

            // Set monster element level
            monster_element_level_text.innerText = monster.element_level + "%";

            setTimeout(() => {
                monster_dropdown.style.visibility = "hidden";
            }, 300);
            
        };

        // Add the div node to the monster list
        monster_list.appendChild(div_node);
    });
}