import { character_config } from "../calculator/character_config.js";
import { calculateDamage } from "../calculator/damage.js";

export {
    initDmgWidget,
}

/*
            <h2>Damage results</h2>

            <div>
                <label>Base damage:</label>
                <output id="min_base_dmg">0</output>
                -
                <output id="max_base_dmg">0</output>
            </div>

            <div>
                <label>Critical damage:</label>
                <output id="min_crit_dmg">0</output>
                -
                <output id="mmax_crit_dmg">0</output>
            </div>


            <div>
                <label>Softcrit damage:</label>
                <output id="min_softcrit_dmg">0</output>
                -
                <output id="max_softcrit_dmg">0</output>
            </div>

            <div>
                <label>Softcrit + Critical damage:</label>
                <output id="min_softcrit_crit_dmg">0</output>
                -
                <output id="max_softcrit_crit_dmg">0</output>
            </div>

            <button id="calculate_btn">Calculate</button>
*/

let monsters;

function initDmgWidget(monsters_array) {
    const calculate_btn = document.getElementById("calculate_btn");
    calculate_btn.addEventListener("click", onCalculateDamageClicked);

    monsters = monsters_array;
}

function onCalculateDamageClicked() {
    const min_dmg = document.getElementById("min_base_dmg");
    const max_dmg = document.getElementById("max_base_dmg");
    const min_crit_dmg = document.getElementById("min_crit_dmg");
    const max_crit_dmg = document.getElementById("max_crit_dmg");
    const min_softcrit_dmg = document.getElementById("min_softcrit_dmg");
    const max_softcrit_dmg = document.getElementById("max_softcrit_dmg");
    const min_hardcrit_dmg = document.getElementById("min_hardcrit_dmg");
    const max_hardcrit_dmg = document.getElementById("max_hardcrit_dmg");

    const dmg = calculateDamage(character_config, getCurrentMonster());

    min_dmg.value = dmg.base.min;
    max_dmg.value = dmg.base.max;
    min_crit_dmg.value = dmg.critical.min;
    max_crit_dmg.value = dmg.critical.max;
    min_softcrit_dmg.value = dmg.softcrit.min;
    max_softcrit_dmg.value = dmg.softcrit.max;
    min_hardcrit_dmg.value = dmg.hardcrit.min;
    max_hardcrit_dmg.value = dmg.hardcrit.max;
}

function getCurrentMonster() {
    const current_monster = document.getElementById("current-monster");
    const vnum = parseInt(current_monster.getAttribute("vnum"));

    return monsters.find(monster => monster.vnum == vnum);
}