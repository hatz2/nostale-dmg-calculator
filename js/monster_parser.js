import { AttackType } from "./enums.js"
import { normalizeEOL } from "./utils.js";

export {
    Monster,
    MonsterDatParser,
    MonsterNameParser,
}

/**
 * Data class with the information needed from a monster
 */
class Monster {
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
        this.vnum = vnum;
        this.name = name;
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
class MonsterDatParser {
    #data;
    #monster_names;
    
    constructor(data, monster_names) {
        this.#data = normalizeEOL(data);
        this.#monster_names = monster_names;
    }

    parse() {
        const entries = this.#splitDataIntoEntries(this.#data);
        const monsters = this.#parseEntries(entries);
        return this.#replaceMonsterNameIdsWithName(monsters);
    }

    #parseEntries(entries) {
        const monsters = [];

        entries.forEach(entry => {
            const entry_parser = new EntryParser(entry);
            const monster = entry_parser.parse();
            monsters.push(monster);
        });

        return monsters;
    }

    #replaceMonsterNameIdsWithName(monsters) {
        monsters.forEach(monster => {
            if (monster.name !== undefined) {
                monster.name = this.#monster_names.get(monster.name);
            }
        });

        return monsters;
    }
    
    #splitDataIntoEntries(data) {
        const entries = data.split("#========================================================\n");
        // Remove empty entries (usually the ones between two separators)
        return entries.filter(Boolean);
    }
}

/**
 * Parses a singular entry from monster.dat
 */
class EntryParser {
    #splitted_entry

    constructor(entry) {
        this.#splitted_entry = this.#splitEntry(entry);
    }

    #splitEntry(entry) {
        return entry.split("\n").filter(Boolean);
    }

    /**
     * @returns The Monster representation of the entry
     */
    parse() {
        let vnum, name, level, race, armor, element, element_level, resistances, armor_upgrade;
        let icon_id, skin;

        this.#splitted_entry.forEach(row_data => {
            const row = new Row(row_data);
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

/**
 * Base class for each row in a monster.dat entry
 */
class Row {
    #splitted_row

    constructor(row) {
        this.#splitted_row = this.#splitEntryRow(row);
    }

    #splitEntryRow(row) {
        return row.split("\t").filter(Boolean);
    }

    getHeader() {
        return this.get(0);
    }

    get(index) {
        return this.#splitted_row[index];
    }
}

class VnumRow extends Row {
    getVnum() {
        return parseInt(this.get(1));
    }
}

class NameRow extends Row {
    getName() {
        return this.get(1);
    }
}

class LevelRow extends Row {
    getLevel() {
        return parseInt(this.get(1));
    }
}

class RaceRow extends Row {
    getRace() {
        return parseInt(this.get(1));
    }
}

class AttribRow extends Row {
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

class ArmorRow extends Row {
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

class ArmorInfoRow extends Row {
    getArmorUpgrade() {
        return parseInt(this.get(2));
    }
}

class SettingRow extends Row {
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

/**
 * Parses the file _code_uk_monster.txt
 */
class MonsterNameParser {
    #data

    constructor(data) {
        this.#data = normalizeEOL(data);
        this.#replaceCaretWithSpace();
    }

    /**
     * @returns A map with name id as keys and the name as value
     */
    parse() {
        const names = new Map();
        const entries = this.#splitIntoEntries();

        entries.forEach(entry => {
            const entry_data = MonsterNameEntry.fromRow(entry);
            names.set(entry_data.getId(), entry_data.getName());
        });

        return names;
    }

    #splitIntoEntries() {
        return this.#data.split('\n').filter(Boolean);
    }

    #replaceCaretWithSpace() {
        this.#data = this.#data.replaceAll("^", " ");
    }
}

/**
 * Represents each row of _code_uk_monster.txt
 */
class MonsterNameEntry {
    #splitted_entry

    constructor(splitted_entry) {
        this.#splitted_entry = splitted_entry;
    }

    static fromRow(entry) {
        return new MonsterNameEntry(this.#splitEntry(entry));
    }

    static #splitEntry(entry) {
        return entry.split('\t').filter(Boolean);
    }

    getId() {
        return this.#splitted_entry[0];
    }
    
    getName() {
        return this.#splitted_entry[1];
    }
}