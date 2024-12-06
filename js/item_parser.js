import { DatObject, DatParser, DatRow } from "./dat_parser.js";

export {
    Item,
    ItemDatParser,
}

// TODO: Add orange buff efects
class Item extends DatObject {
    constructor(
        vnum, 
        name, 
        inventory_tab, 
        item_type, 
        item_subtype, 
        eq_slot, 
        icon_id, 
        attack_type, 
        required_class
    ) {
        super(vnum, name);

        this.inventory_tab = inventory_tab;
        this.item_type = item_type;
        this.item_subtype = item_subtype;
        this.eq_slot = eq_slot;
        this.icon_id = icon_id;
        this.attack_type = attack_type;
        this.required_class = required_class;
    }
}

class ItemDatParser extends DatParser {
    constructor(data, names_map) {
        const row_parsers = {
            "VNUM": VnumRow,
            "NAME": NameRow,
            "INDEX": IndexRow,
            "TYPE": TypeRow,
            "BUFF": BuffRow,
        }

        super(data, names_map, row_parsers, Item)
    }
}

class VnumRow extends DatRow {
    applyTo(obj) {
        obj.vnum = this.getVnum();
    }

    getVnum() {
        return parseInt(this.get(1));
    }

    getPrice() {
        return parseInt(this.get(2));
    }
}

class NameRow extends DatRow {
    applyTo(obj) {
        obj.name = this.getCodeName();
    }

    getCodeName() {
        return this.get(1);
    }
}

class IndexRow extends DatRow {
    applyTo(obj) {
        obj.inventory_tab = this.getInventoryTab();
        obj.item_type = this.getItemType();
        obj.item_subtype = this.getItemSubType();
        obj.eq_slot = this.getEqSlot();
        obj.icon_id = this.getIconId();
    }

    getInventoryTab() {
        return this.get(1);
    }

    getItemType() {
        return this.get(2);
    }

    getItemSubType() {
        return this.get(3);
    }

    getEqSlot() {
        return this.get(4);
    }

    getIconId() {
        return this.get(5);
    }
}

class TypeRow extends DatRow {
    applyTo(obj) {
        obj.attack_type = this.getAttackType();
        obj.required_class = this.getRequiredClass();
    }

    getAttackType() {
        return this.get(1);
    }

    getRequiredClass() {
        return this.get(2);
    }
}

class BuffRow extends DatRow {
    // TODO: Implement
}


