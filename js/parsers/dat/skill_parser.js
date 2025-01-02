import { BuffInfo } from "./buff_info.js";
import { DatObject, DatParser, DatRow } from "./dat_parser.js";


export class Skill extends DatObject {
    constructor(vnum, name) {
        super(vnum, name);
        this.type = undefined;
        this.id = undefined;
        this.class = undefined;
        this.attack_type = undefined;
        this.uses_secondary_weapon = undefined;
        this.element = undefined;
        this.icon_id = undefined;
        this.buffs = []

    }
}

export class SkillDatParser extends DatParser {
    constructor(data, names_map) {
        const row_parsers = {
            "VNUM": VnumRow,
            "NAME": NameRow,
            "TYPE": TypeRow,
            "EFFECT": EffectRow,
            "BASIC": BasicRow,
        }

        super(data, names_map, row_parsers, Skill);
    }
}

class VnumRow extends DatRow {
    applyTo(obj) {
        obj.vnum = this.getInt(1);
    }
}

class NameRow extends DatRow {
    applyTo(obj) {
        obj.name = this.get(1);
    }
}

class TypeRow extends DatRow {
    applyTo(obj) {
        obj.type = this.getInt(1);
        obj.id = this.getInt(2);
        obj.class = this.getInt(3);
        obj.attack_type = this.getInt(4);
        obj.uses_secondary_weapon = this.getInt(5);
        obj.element = this.getInt(6);
    }
}

class EffectRow extends DatRow {
    applyTo(obj) {
        obj.icon_id = this.getInt(1);
    }
}

class BasicRow extends DatRow {
    applyTo(obj) {
        obj.buffs.push(
            new BuffInfo(
                this.getInt(2),
                this.getValues(),
                this.getInt(3),
                this.getInt(6)
            )
        );
    }

    getValues() {
        const values = [
            Math.floor(this.getInt(4) / 4),
            Math.floor(this.getInt(5) / 4)
        ];

        return values;
    }
}