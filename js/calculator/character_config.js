import { EquipSlot } from "../enums.js"

class CharacterConfig {
    constructor() {
        this.#initItems();
    }

    #initItems() {
        this.weapon = undefined;
        this.offhand = undefined;
        this.armor = undefined;
        this.mask = undefined;
        this.hat = undefined;
        this.fairy = undefined;
        this.sp = undefined;
        this.gloves = undefined;
        this.boots = undefined;
        this.ring = undefined;
        this.necklace = undefined;
        this.bracelet = undefined;
        this.costume_wings = undefined;
        this.mini_pet = undefined;
        this.amulet = undefined;
        this.costume_weapon = undefined;
        this.costume_hat = undefined;
        this.costume_body = undefined;
        this.skill = undefined;
        this.sp_bonuses = undefined;
        this.sp_config = new SpConfig();
        this.level = 1;
        this.base_dmg = 10;
    }

    clear() {
        this.#initItems();
    }

    setItem(eqslot, item) {
        if (eqslot == EquipSlot.MAIN_WEAPON) {
            this.weapon = structuredClone(item);
        }
        else if (eqslot == EquipSlot.SECONDARY_WEAPON) {
            this.offhand = structuredClone(item);
        }
        else if (eqslot == EquipSlot.MASK) {
            this.mask = structuredClone(item);
        }
        else if (eqslot == EquipSlot.HAT) {
            this.hat = structuredClone(item);
        }
        else if (eqslot == EquipSlot.FAIRY) {
            this.fairy = structuredClone(item);
        }
        else if (eqslot == EquipSlot.SP) {
            this.sp = structuredClone(item);
        }
        else if (eqslot == EquipSlot.GLOVES) {
            this.gloves = structuredClone(item);
        }
        else if (eqslot == EquipSlot.BOOTS) {
            this.boots = structuredClone(item);
        }
        else if (eqslot == EquipSlot.ARMOR) {
            this.armor = structuredClone(item);
        }
        else if (eqslot == EquipSlot.RING) {
            this.ring = structuredClone(item);
        }
        else if (eqslot == EquipSlot.NECKLACE) {
            this.necklace = structuredClone(item);
        }
        else if (eqslot == EquipSlot.BRACELET) {
            this.bracelet = structuredClone(item);
        }
        else if (eqslot == EquipSlot.WINGS_COSTUME) {
            this.costume_wings = structuredClone(item);
        }
        else if (eqslot == EquipSlot.MINIPET) {
            this.mini_pet = structuredClone(item);
        }
        else if (eqslot == EquipSlot.AMULET) {
            this.amulet = structuredClone(item);
        }
        else if (eqslot == EquipSlot.WEAPON_COSTUME) {
            this.costume_weapon = structuredClone(item);
        }
        else if (eqslot == EquipSlot.HAT_COSTUME) {
            this.costume_hat = structuredClone(item);
        }
        else if (eqslot == EquipSlot.BODY_COSTUME) {
            this.costume_body = structuredClone(item);
        }
    }

    getItem(eqslot) {
        if (eqslot == EquipSlot.MAIN_WEAPON) {
            return this.weapon
        }
        else if (eqslot == EquipSlot.SECONDARY_WEAPON) {
            return this.offhand;
        }
        else if (eqslot == EquipSlot.MASK) {
            return this.mask;
        }
        else if (eqslot == EquipSlot.HAT) {
            return this.hat;
        }
        else if (eqslot == EquipSlot.FAIRY) {
            return this.fairy;
        }
        else if (eqslot == EquipSlot.SP) {
            return this.sp;
        }
        else if (eqslot == EquipSlot.GLOVES) {
            return this.gloves;
        }
        else if (eqslot == EquipSlot.BOOTS) {
            return this.boots;
        }
        else if (eqslot == EquipSlot.ARMOR) {
            return this.armor;
        }
        else if (eqslot == EquipSlot.RING) {
            return this.ring;
        }
        else if (eqslot == EquipSlot.NECKLACE) {
            return this.necklace;
        }
        else if (eqslot == EquipSlot.BRACELET) {
            return this.bracelet;
        }
        else if (eqslot == EquipSlot.WINGS_COSTUME) {
            return this.costume_wings;
        }
        else if (eqslot == EquipSlot.MINIPET) {
            return this.mini_pet;
        }
        else if (eqslot == EquipSlot.AMULET) {
            return this.amulet;
        }
        else if (eqslot == EquipSlot.WEAPON_COSTUME) {
            return this.costume_weapon;
        }
        else if (eqslot == EquipSlot.HAT_COSTUME) {
            return this.costume_hat;
        }
        else if (eqslot == EquipSlot.BODY_COSTUME) {
            return this.costume_body;
        }
    }
}

class SpConfig {
    constructor() {
        this.resetFields();
    }

    resetFields() {
        this.attack = 0;
        this.defence = 0;
        this.element = 0;
        this.hp_mp = 0;
        this.attack_perf = 0;
        this.defence_perf = 0;
        this.element_perf = 0;
        this.hp_mp_perf = 0;
    }
}

export var character_config = new CharacterConfig();