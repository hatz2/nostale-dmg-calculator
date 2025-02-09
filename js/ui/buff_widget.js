import { getDpsBcardBonuses } from "../calculator/bcard_bonus.js"
import { character_config } from "../calculator/character_config.js"
import { formatString } from "../utils.js";
import { getBuffFormattedText} from "./bcard_text.js";

export {
    initBuffsWidget,
    displayEquippedOrangeBuffs
}

let bcards;

function initBuffsWidget(bcards_array) {
    bcards = bcards_array;
}

function displayEquippedOrangeBuffs() {
    const bonuses = getDpsBcardBonuses(character_config);
    console.log(bonuses);
    const buff_widget = document.getElementById("buff-widget");
    let full_text = "";

    for (const bonus_id in bonuses) {
        const bonus = bonuses[bonus_id];

        if (bonus.bcard_vnum === -1) {
            continue;
        }

        const bcard = bcards.find(b => b.vnum === bonus.bcard_vnum);
        if (bcard === undefined) {
            console.error(`Could not find bcard with vnum ${bonus.bcard_vnum}`);
            continue;
        }

        const buff_text = getBuffFormattedText(bonus, bcards);

        full_text += buff_text + "<br>";
    }

    buff_widget.innerHTML = full_text;
}