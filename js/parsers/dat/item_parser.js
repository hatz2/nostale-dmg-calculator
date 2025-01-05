import { AccessorySubType, InventoryTab, ItemType } from "../../enums.js";
import { BuffInfo } from "./buff_info.js";
import { DatObject, DatParser, DatRow } from "./dat_parser.js";

export {
    Item,
    ItemDatParser,
}

class Item extends DatObject {
    constructor(
        vnum, 
        name,
        price,
        inventory_tab, 
        item_type, 
        item_subtype, 
        eq_slot, 
        icon_id, 
        attack_type, 
        required_class,
        is_limited,
        is_hero_eq,
        visual_change_id,
    ) {
        super(vnum, name);
        this.price = price;
        this.inventory_tab = inventory_tab;
        this.item_type = item_type;
        this.item_subtype = item_subtype;
        this.eq_slot = eq_slot;
        this.icon_id = icon_id;
        this.attack_type = attack_type;
        this.required_class = required_class;
        this.is_limited = is_limited;
        this.is_hero_eq = is_hero_eq;
        this.visual_change_id = visual_change_id;
        this.buffs = [];
        this.data = {};
    }

    isWeapon() {
        return this.inventory_tab == InventoryTab.EQUIP &&
            this.item_type == ItemType.WEAPON;
    }

    isFairy() {
        return this.inventory_tab == InventoryTab.EQUIP &&
            this.item_type == ItemType.ACCESSORY &&
            this.item_subtype == AccessorySubType.FAIRY;
    }

    isSp() {
        return this.inventory_tab == InventoryTab.EQUIP &&
            this.item_type == ItemType.SPECIALIST;
    }

    isEquipment() {
        return this.inventory_tab == InventoryTab.EQUIP &&
            this.item_type == ItemType.EQUIPMENT;
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
            "FLAG": FlagRow,
            "DATA": DataRow,
        }

        super(data, names_map, row_parsers, Item);
    }
}

class VnumRow extends DatRow {
    applyTo(obj) {
        obj.vnum = this.getVnum();
        obj.price = this.getPrice();
    }

    getVnum() {
        return this.getInt(1);
    }

    getPrice() {
        return this.getInt(2);
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
        obj.visual_change_id = this.getVisualChangeId();
    }

    getInventoryTab() {
        return this.getInt(1) % 4;
    }

    getItemType() {
        return this.getInt(2);
    }

    getItemSubType() {
        return this.getInt(3);
    }

    getEqSlot() {
        return this.getInt(4);
    }

    getIconId() {
        return this.getInt(5);
    }

    getVisualChangeId() {
        return this.getInt(6);
    }
}

class TypeRow extends DatRow {
    applyTo(obj) {
        obj.attack_type = this.getAttackType();
        obj.required_class = this.getRequiredClass();
    }

    getAttackType() {
        return this.getInt(1);
    }

    getRequiredClass() {
        return this.getInt(2);
    }
}

class FlagRow extends DatRow {
    applyTo(obj) {
        obj.is_limited = this.getIsLimited();
        obj.is_hero_eq = this.getIsHeroEq();
    }

    getIsLimited() {
        return this.getInt(23);
    }

    getIsHeroEq() {
        return this.getInt(21);
    }
}

class BuffRow extends DatRow {
    applyTo(obj) {

        for (let i = 1; i < this.getSize(); i += 5) {
            const buff = new BuffInfo(
                this.getBCardVnum(i),
                this.getValues(i),
                this.getBCardSub(i),
                this.getTarget(i)
            );

            obj.buffs.push(buff);
        }
    }

    getBCardVnum(item_index) {
        return this.getInt(item_index + 0);
    }

    getValues(item_index) {
        // Get the real values divided by 4
        const values = [
            this.getInt(item_index + 1), 
            this.getInt(item_index + 2)
        ];

        values[0] = Math.floor(values[0] / 4);
        values[1] = Math.floor(values[1] / 4);

        return values;
    }

    getBCardSub(item_index) {
        return this.getInt(item_index + 3);
    }

    getTarget(item_index) {
        return this.getInt(item_index + 4);
    }
}

class DataRow extends DatRow {
    // TODO: implement other item types
    applyTo(obj) {
        if (obj.isWeapon()) {
            this.applyToWeapon(obj);
        }
        else if (obj.isFairy()) {
            this.applyToFairy(obj);
        }
        else if (obj.isSp()) {
            this.applyToSp(obj);
        }
        else if (obj.isEquipment()) {
            this.applyToEquipment(obj);
        }
    }

    applyToWeapon(obj) {
        obj.data.level = this.getInt(1);
        obj.data.dmg_min = this.getInt(2);
        obj.data.dmg_max = this.getInt(3);
        obj.data.hit_rate = this.getInt(4);
        obj.data.crit_chance = this.getInt(5);
        obj.data.crit_damage = this.getInt(6);
        obj.data.upgrade_level = this.getInt(9);
    }

    applyToFairy(obj) {
        obj.data.level = this.getInt(2);
        obj.data.element = this.getInt(1);
    }

    applyToSp(obj) {
        obj.data.morph_id = this.getInt(13);
    }

    applyToEquipment(obj) {
        obj.data.time_left = this.getInt(12);
    }
}


