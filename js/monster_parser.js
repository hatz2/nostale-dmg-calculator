import { AttackType } from "./enums.js"
import { normalizeEOL } from "./utils.js";
import { DatObject, EntryParser, DatParser, DatRow } from "./dat_parser.js";

export {
    Monster,
    MonsterDatParser,
}

/**
 * Data class with the information needed from a monster
 */
class Monster extends DatObject {
    constructor(
        vnum, 
        name, 
        level, 
        race, 
        element, 
        element_level, 
        resistances, 
        armor, 
        armor_upgrade,
        icon_id,
        skin,
    ) {
        super(vnum, name)

        this.level = level;
        this.race = race;
        this.element = element;
        this.element_level = element_level;
        this.resistances = resistances; // Array with the resistances of the 4 elements
        this.armor = armor; // Array with the armor values for eath attack type
        this.armor_upgrade = armor_upgrade;
        this.icon_id = icon_id;
        this.skin = skin;
    }
}

/**
 * monster.dat parser
 */
class MonsterDatParser extends DatParser {

    constructor(data, names) {
        super(data, names, MonsterEntryParser);
    }
}

/**
 * Parses a singular entry from monster.dat
 */
class MonsterEntryParser extends EntryParser {
    constructor(entry) {
        super(entry);
    }

    /**
     * @returns The Monster representation of the entry
     */
    parse() {
        let vnum, name, level, race, armor, element, element_level, resistances, armor_upgrade;
        let icon_id, skin;

        this.splitted_entry.forEach(row_data => {
            const row = new DatRow(row_data);
            const header = row.getHeader();

            if (header == "VNUM") {
                const vnum_row = new VnumRow(row_data);
                vnum = vnum_row.getVnum();
            }
            else if (header == "NAME") {
                const name_row = new NameRow(row_data); 
                name = name_row.getName();
            }
            else if (header == "LEVEL") {
                const level_row = new LevelRow(row_data);
                level = level_row.getLevel();
            }
            else if (header == "RACE") {
                const race_row = new RaceRow(row_data);
                race = race_row.getRace();
            }
            else if (header == "ATTRIB") {
                const attrib_row = new AttribRow(row_data);
                element = attrib_row.getElementType();
                element_level = attrib_row.getElementLevel();
                resistances = [
                    attrib_row.getFireRes(),
                    attrib_row.getWaterRes(),
                    attrib_row.getLigthRes(),
                    attrib_row.getShadowRes(),
                ]
            }
            else if (header == "ARMOR") {
                const armor_row = new ArmorRow(row_data);
                const armor_stat_calculator = new MonsterDefenceStatCalculator(
                    race,
                    armor_row.getArmorLevel(),
                    level,
                    [armor_row.getAddMeleeDef(), armor_row.getAddRangedDef(), armor_row.getAddMagicDef()],
                )
                armor = [
                    armor_stat_calculator.getMeleeDef(),
                    armor_stat_calculator.getRangedDef(),
                    armor_stat_calculator.getMagicDef(),
                ]
            }
            else if (header == "AINFO") {
                const armor_info_row = new ArmorInfoRow(row_data);
                armor_upgrade = armor_info_row.getArmorUpgrade();
            }
            else if (header == "SETTING") {
                const setting_row = new SettingRow(row_data);
                icon_id = setting_row.getIconId();
                skin = setting_row.getSkinId();
            }
        });

        return new Monster(
            vnum,
            name,
            level,
            race,
            element,
            element_level,
            resistances,
            armor,
            armor_upgrade,
            icon_id,
            skin,
        );
    }
}

class VnumRow extends DatRow {
    getVnum() {
        return parseInt(this.get(1));
    }
}

class NameRow extends DatRow {
    getName() {
        return this.get(1);
    }
}

class LevelRow extends DatRow {
    getLevel() {
        return parseInt(this.get(1));
    }
}

class RaceRow extends DatRow {
    getRace() {
        return parseInt(this.get(1));
    }
}

class AttribRow extends DatRow {
    getElementType() {
        return parseInt(this.get(1));
    }

    getElementLevel() {
        return parseInt(this.get(2));
    }

    getFireRes() {
        return parseInt(this.get(3));
    }

    getWaterRes() {
        return parseInt(this.get(4));
    }

    getLigthRes() {
        return parseInt(this.get(5));
    }

    getShadowRes() {
        return parseInt(this.get(6));
    }
}

class ArmorRow extends DatRow {
    getArmorLevel() {
        return parseInt(this.get(1));
    }

    getAddMeleeDef() {
        return parseInt(this.get(2));
    }

    getAddRangedDef() {
        return parseInt(this.get(3));
    }

    getAddMagicDef() {
        return parseInt(this.get(4));
    }
}

class ArmorInfoRow extends DatRow {
    getArmorUpgrade() {
        return parseInt(this.get(2));
    }
}

class SettingRow extends DatRow {
    getIconId() {
        return 8000 + this.getSkinId();
    }

    getSkinId() {
        return parseInt(this.get(1));
    }
}

/**
 * Calculator to get the real defence stats of a monster
 */
class MonsterDefenceStatCalculator {
    static #race_defences = {
        0: [16, 13.5, 11, 50, 50, 50],
        1: [20, 17, 19, 100, 100, 100],
        2: [15, 15, 15, 75, 50, 40],
        3: [15, 15, 15, 50, 50, 50],
        4: [17.4, 17.4, 17.4, 60, 60, 100],
        5: [13.4, 13.4, 13.4, 40, 40, 40],
        6: [11.5, 15, 25, 50, 50, 75],
        8: [10, 10, 10, 100, 100, 100],
    }
    static #def_multiplier_per_atk_type = [0.08, 0.36, 0.04];

    #race
    #armor_level
    #level
    #add_defences

    constructor(race, armor_level, level, add_defences) {
        this.#race = race;
        this.#armor_level = armor_level;
        this.#level = level;
        this.#add_defences = add_defences;
    }

    getMeleeDef() {
        return this.#calculateDefStat(AttackType.MELEE);
    }

    getRangedDef() {
        return this.#calculateDefStat(AttackType.RANGED);
    }

    getMagicDef() {
        return this.#calculateDefStat(AttackType.MAGIC);
    }

    #calculateDefStat(attack_type) {
        const race_defs = [
            MonsterDefenceStatCalculator.#race_defences[this.#race][attack_type],
            MonsterDefenceStatCalculator.#race_defences[this.#race][attack_type + 3],
        ]
        const def_factor = MonsterDefenceStatCalculator.#def_multiplier_per_atk_type[attack_type];

        return Math.floor(
            2 * this.#armor_level + race_defs[0] +
            Math.floor((this.#armor_level + 5) * def_factor) +
            (this.#level - 1) * (race_defs[1] / 100.0) +
            this.#add_defences[attack_type]
        )
    }
}