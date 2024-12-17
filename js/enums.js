export {
    Elem,
    Resistance,
    AttackType,
    InventoryTab,
    ItemType,
    WeaponSubType,
    ArmorSubType,
    EquipmentSubType,
    AccessorySubType,
    SpecialistSubType,
    ClassFlag
}

const Elem = {
    NONE: 0,
    FIRE: 1,
    WATER: 2,
    LIGHT: 3,
    SHADOW: 4,
}

const Resistance = {
    FIRE: 0,
    WATER: 1,
    LIGHT: 2,
    SHADOW: 3,
}

const AttackType = {
    MELEE: 0,
    RANGED: 1,
    MAGIC: 2,
}

const InventoryTab = {
    EQUIP: 0,
    MAIN: 1,
    ETC: 2,
}

const ItemType = {
    WEAPON: 0,
    ARMOR: 1,
    EQUIPMENT: 2,
    ACCESSORY: 3,
    SPECIALIST: 4,
}

const WeaponSubType = {
    ADV_SWORD: 0,
    SWORD: 1,
    DAGGER: 3,
    FIRST: 4,
    SLINGSHOT: 5,
    BOW: 6,
    SPELLGUN: 8,
    WAND: 9,
    TOKEN: 11,
}

const ArmorSubType = {
    ADVENTURER: 0,
    MAGE: 1,
    ARCHER: 2,
    SWORDSMAN: 3,
    PARTNER: 4,
    MARTIAL: 5,
}

const EquipmentSubType = {
    HAT: 0,
    MASK: 1,
    GLOVES: 2,
    BOOTS: 3,
    COSTUME: 4,
    COSTUME_HAT: 5,
    COSTUME_WEAPON: 6,
    COSTUME_WINGS: 7,
}

const AccessorySubType = {
    NECKLACE: 0,
    RING: 1,
    BRACELET: 2,
    FAIRY: 3,
    AMULET: 4,
    MINI_PET: 5,
}

const SpecialistSubType = {
    EVENT_SP: 0,
    CLASS_SP: 1,
}

const ClassFlag = {
    ADVENTURER: 1,
    SWORDSMAN: 2,
    ARCHER: 4,
    MAGE: 8,
    MARTIAL_ARTIST: 16,
}