import { formatString } from "../utils.js";

export {
    getBuffFormattedText
}

function getBuffFormattedText(buff, bcards) {
    let text = "";

    if (buff.bcard_vnum <= 0)
        return text;

    let bcard = bcards.filter((elem) => elem.vnum == buff.bcard_vnum)[0];

    const desc = parseInt(bcard.desc[buff.bcard_sub]);
    const values = [Math.abs(buff.values[0]), Math.abs(buff.values[1])];

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

        values[0] = RACE_TO_TEXT[race_id];
    }

    const text_template = bcard.list[buff.bcard_sub][buff.values[0] >= 0 ? 0 : 1];
    text = formatString(text_template, values);
    return text;
}