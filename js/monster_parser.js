import { DatObject, DatParser, DatRow } from "./dat_parser.js";
import { MonsterDefenceStatCalculator } from "./monster_def_calculator.js";

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
        armor_level,
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
        this.armor_level = armor_level; // Level of armor used to calculate defences
        this.armor = armor; // Array with the armor values for eath attack type
        this.armor_upgrade = armor_upgrade;
        this.icon_id = icon_id;
        this.skin = skin;
    }
}

class MonsterDatParser extends DatParser {

    constructor(data, names) {
        const row_parsers = {
            "VNUM": VnumRow,
            "NAME": NameRow,
            "LEVEL": LevelRow,
            "RACE": RaceRow,
            "ATTRIB": AttribRow,
            "ARMOR": ArmorRow,
            "AINFO": ArmorInfoRow,
            "SETTING": SettingRow,
        }

        super(data, names, row_parsers, Monster);
    }

    parse() {
        const monsters = super.parse();
        monsters.forEach(monster => {
            const armor_stat_calc = new MonsterDefenceStatCalculator(
                monster.race,
                monster.armor_level,
                monster.level,
                monster.armor,
            )

            monster.armor = [
                armor_stat_calc.getMeleeDef(),
                armor_stat_calc.getRangedDef(),
                armor_stat_calc.getMagicDef(),
            ]
        });

        return monsters;
    }
}

class VnumRow extends DatRow {
    applyTo(obj) {
        obj.vnum = this.getVnum();
    }

    getVnum() {
        return parseInt(this.get(1));
    }
}

class NameRow extends DatRow {
    applyTo(obj) {
        obj.name = this.getName();
    }

    getName() {
        return this.get(1);
    }
}

class LevelRow extends DatRow {
    applyTo(obj) {
        obj.level = this.getLevel();
    }

    getLevel() {
        return parseInt(this.get(1));
    }
}

class RaceRow extends DatRow {
    applyTo(obj) {
        obj.race = this.getRace();
    }

    getRace() {
        return parseInt(this.get(1));
    }
}

class AttribRow extends DatRow {
    applyTo(obj) {
        obj.element = this.getElementType();
        obj.element_level = this.getElementLevel();
        obj.resistances = [
            this.getFireRes(),
            this.getWaterRes(),
            this.getLigthRes(),
            this.getShadowRes(),
        ]
    }

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
    applyTo(obj) {
        obj.armor_level = this.getArmorLevel();
        obj.armor = [
            this.getAddMeleeDef(),
            this.getAddRangedDef(),
            this.getAddMagicDef(),
        ]
    }


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
    applyTo(obj) {
        obj.armor_upgrade = this.getArmorUpgrade();
    }

    getArmorUpgrade() {
        return parseInt(this.get(2));
    }
}

class SettingRow extends DatRow {
    applyTo(obj) {
        obj.icon_id = this.getIconId();
        obj.skin = this.getSkinId();
    }

    getIconId() {
        return 8000 + this.getSkinId();
    }

    getSkinId() {
        return parseInt(this.get(1));
    }
}