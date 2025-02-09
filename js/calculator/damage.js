import { AttackType, Elem } from "../enums.js";
import { getDpsBcardBonuses } from "./bcard_bonus.js";
import { calculateAttackAddition, calculateElementAddition } from "./sp_stats.js";

export {
    calculateDamage,
    Damage
}

class Damage {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    add(other) {
        this.min += other.min;
        this.max += other.max;
    }

    mul(other) {
        this.min *= other.min;
        this.max *= other.max;
    }
    
    sub(other) {
        this.min -= other.min;
        this.max -= other.max;
    }

    copy() {
        return new Damage(this.min, this.max);
    }

    addFlat(value) {
        this.min += value;
        this.max += value;
    }
}

class CalculatedDamage {
    constructor() {
        this.#init();
    }

    #init() {
        this.base = new Damage(0, 0);
        this.critical = new Damage(0, 0);
        this.softcrit = new Damage(0, 0);
        this.hardcrit = new Damage(0, 0);
    }

    add(other) {
        this.base.add(other.base);
        this.critical.add(other.critical);
        this.softcrit.add(other.softcrit);
        this.hardcrit.add(other.hardcrit);
    }
    
    mul(other) {
        this.base.mul(other.base);
        this.critical.mul(other.critical);
        this.softcrit.mul(other.softcrit);
        this.hardcrit.mul(other.hardcrit);
    }

    sub(other) {
        this.base.sub(other.base);
        this.critical.sub(other.critical);
        this.softcrit.sub(other.softcrit);
        this.hardcrit.sub(other.hardcrit);
    }

    round() {
        this.base.min = Math.round(this.base.min);
        this.base.max = Math.round(this.base.max);
        this.critical.min = Math.round(this.critical.min);
        this.critical.max = Math.round(this.critical.max);
        this.softcrit.min = Math.round(this.softcrit.min);
        this.softcrit.max = Math.round(this.softcrit.max);
        this.hardcrit.min = Math.round(this.hardcrit.min);
        this.hardcrit.max = Math.round(this.hardcrit.max);
    }

    addFlat(value) {
        this.base.addFlat(value);
        this.critical.addFlat(value);
        this.softcrit.addFlat(value);
        this.hardcrit.addFlat(value);
    }
}

const UPGRADE_BONUS_TABLE = {
    0: 0.0,
    1: 0.1,
    2: 0.15,
    3: 0.22,
    4: 0.32,
    5: 0.43,
    6: 0.54,
    7: 0.65,
    8: 0.90,
    9: 1.20,
    10: 2.00,
}

// Returns an instance of CalculatedDamage
function calculateDamage(character_config, monster) {
    const bonuses = getDpsBcardBonuses(character_config);
    const physical_dmg = calculatePhysicalDamage(character_config, monster, bonuses);
    const elemental_dmg = calculateElementalDamage(character_config, monster, bonuses);
    const morale_dmg = calculateMoraleDamage(character_config, monster, bonuses);
    const percent_dmg_increase = calculatePercentDamageIncrease(character_config, bonuses);

    let total_dmg = new CalculatedDamage();
    
    total_dmg.add(physical_dmg);
    total_dmg.add(elemental_dmg);
    total_dmg.add(morale_dmg);
    total_dmg.mul(percent_dmg_increase);

    // Round
    total_dmg.round();

    return total_dmg;
}

// Returns an instance of CalculatedDamage
function calculatePhysicalDamage(character_config, monster, bonuses) {
    const total_atk = calculateTotalAttack(character_config, monster, bonuses);
    const total_def = calculateTotalDefense(character_config, monster, bonuses);
    const total_crit = calculateTotalCritical(character_config, bonuses);

    let damage = new CalculatedDamage();

    damage.add(total_atk);
    damage.sub(total_def);
    damage.critical.mul(total_crit);
    damage.hardcrit.mul(total_crit);

    return damage;
}

// Returns an instance of CalculatedDamage
function calculateTotalAttack(character_config, monster, bonuses) {
    const attack_power = calculateAttackPower(character_config, bonuses);
    const weapon_damage = calculateWeaponDamage(character_config);
    const upgrade_bonus = calculateUpgradeBonus(character_config, monster);
    const attack_increase_bonus = calculateAttackIncreaseBonus(character_config, bonuses);

    let dmg = new Damage(0, 0);

    dmg.add(attack_power);
    weapon_damage.mul(upgrade_bonus)
    dmg.add(weapon_damage);
    dmg.add(new Damage(15, 15));

    let total_dmg = new CalculatedDamage();
    total_dmg.base = dmg.copy();
    total_dmg.critical = dmg.copy();

    // Add softcrit increase bonus
    dmg.mul(attack_increase_bonus);
    total_dmg.softcrit = dmg.copy();
    total_dmg.hardcrit = dmg.copy();

    return total_dmg;
}

function calculateAttackPower(character_config, bonuses) {
    // Start with character base damage
    let result = new Damage(character_config.base_dmg, character_config.base_dmg);
    const attack_type = character_config.skill.attack_type;

    // Add all attack increase bonus
    if (Object.hasOwn(bonuses, 30)) {
        const val = bonuses[30].values[0];
        result.addFlat(val);
    }

    // Add specific attack type bonuses
    let attack_type_bonus_id = 31 + attack_type;
    if (Object.hasOwn(bonuses, attack_type_bonus_id)) {
        const val = bonuses[attack_type_bonus_id].values[0];
        result.addFlat(val);
    }

    // TODO: Add base dmg to X race

    // Bonus from SP attack points and gems
    if (character_config.sp !== undefined) {
        let attack_power_inc = calculateAttackAddition(character_config.sp_config.attack, character_config.sp_config.attack_perf);
        result.addFlat(attack_power_inc);

        // Bonus from SP points thresholds
        const sp_bonuses = character_config.sp_bonuses;
        if (sp_bonuses !== undefined) {
            if (Object.hasOwn(sp_bonuses, 2730)) {
                result.addFlat(sp_bonuses[2730]);
            }

            if (Object.hasOwn(sp_bonuses, 2739)) {
                result.addFlat(sp_bonuses[2739]);
            }
        }
    }

    return result;
}

function calculateWeaponDamage(character_config) {
    const uses_secondary_weapon = character_config.skill.uses_secondary_weapon;

    if (uses_secondary_weapon) {
        if (character_config.offhand === undefined) {
            return new Damage(0, 0);
        }

        return new Damage(character_config.offhand.data.dmg_min, character_config.offhand.data.dmg_max);
    }
    else {
        if (character_config.weapon === undefined) {
            return new Damage(0, 0);
        }
        return new Damage(character_config.weapon.data.dmg_min, character_config.weapon.data.dmg_max);
    }
}

function calculateUpgradeBonus(character_config, monster) {
    // TODO: Add attack level increase buff

    const uses_secondary_weapon = character_config.skill.uses_secondary_weapon;
    let bonus_diff = 0;

    if (uses_secondary_weapon) {
        if (character_config.offhand === undefined) {
            return new Damage(0, 0);
        }

        bonus_diff = Math.max(0, character_config.offhand.data.upgrade_level - monster.armor_upgrade);
    }
    else {
        if (character_config.weapon === undefined) {
            return new Damage(0, 0);
        }

        bonus_diff = Math.max(0, character_config.weapon.data.upgrade_level - monster.armor_upgrade);
    }

    const bonus = 1.0 + UPGRADE_BONUS_TABLE[bonus_diff];
    return new Damage(bonus, bonus);
}

function calculateAttackIncreaseBonus(character_config, bonuses) {
    if (!Object.hasOwn(bonuses, 80)) {
        return new Damage(1.0, 1.0);
    }

    const bonus = 1 + (bonuses[80].values[1] / 100.0);
    return new Damage(bonus, bonus);
}

// Returns an instance of CalculatedDamage
function calculateElementalDamage(character_config, monster, bonuses) {
    const elemental_power = calculateElementalPower(character_config, bonuses);
    const total_atk = calculateTotalAttack(character_config, monster, bonuses);
    const fairy_level = calculateFairyLevel(character_config, bonuses);
    const resistance = calculateResistance(character_config, monster, bonuses);
    const element_bonus = calculateElementBonus(character_config, monster);

    // Basically if we have no fairy or a fairy without element, we return 0 damage
    if (getCharElementType(character_config) === Elem.NONE) {
        return new CalculatedDamage();
    }

    total_atk.addFlat(100);
    total_atk.mul(fairy_level);

    let damage = new CalculatedDamage();
    damage.add(elemental_power);
    damage.add(total_atk);
    damage.mul(resistance);
    damage.mul(element_bonus);

    return damage;
}

function getCharElementType(character_config) {
    if (character_config.fairy === undefined) {
        return Elem.NONE;
    }

    // Check if skill element matches
    const fairy_element = character_config.fairy.data.element;
    const skill_element = character_config.skill.element;

    return fairy_element === skill_element ? fairy_element : Elem.NONE;
}

function calculateElementalPower(character_config, bonuses) {
    const element_type = getCharElementType(character_config);
    let result = 0;

    // Add all elemental power bonuses
    if (Object.hasOwn(bonuses, 74)) {
        const val = bonuses[74].values[0];
        result += val;
    }

    // Add specific elemental power bonuses
    let element_bonus_id = 69 + element_type;
    if (Object.hasOwn(bonuses, element_bonus_id)) {
        const val = bonuses[element_bonus_id].values[0];
        result += val;
    }


    let dmg = new CalculatedDamage();
    dmg.addFlat(result);

    return dmg;
}

function calculateFairyLevel(character_config, bonuses) {
    if (character_config.fairy === undefined) {
        return 0;
    }

    let result = character_config.fairy.data.level;

    // Add fairy bonuses
    if (Object.hasOwn(bonuses, 960)) {
        result += bonuses[960].values[0];
    }

    if (Object.hasOwn(bonuses, 961)) {
        result += bonuses[961].values[0];
    }

    // Add element from SP points
    if (character_config.sp !== undefined) {
        const sp_element_points = calculateElementAddition(character_config.sp_config.element, character_config.sp_config.element_perf);
        result += sp_element_points;

        // Add SP points thresholds
        const sp_bonuses = character_config.sp_bonuses;
        if (sp_bonuses !== undefined) {
            if (Object.hasOwn(sp_bonuses, 2738)) {
                result += sp_bonuses[2738];
            }
        }
    }

    result /= 100.0;

    // TODO: Add bonus from SP element points

    let dmg = new CalculatedDamage();
    dmg.addFlat(result);

    return dmg;
}

function calculateResistance(character_config, monster, bonuses) {
    const element_type = getCharElementType(character_config);
    let resistance = monster.resistances[element_type - 1];

    // Apply resistance debuffs
    if (Object.hasOwn(bonuses, -140)) {
        resistance += bonuses[-140].values[0];
    }

    // Apply specific resistance debuff
    let resistance_debuff_id = -140 - element_type;
    if (Object.hasOwn(bonuses, resistance_debuff_id)) {
        resistance += bonuses[resistance_debuff_id].values[0];
    }

    resistance = 1 - resistance / 100.0;
    resistance = Math.max(0, resistance);

    let dmg = new CalculatedDamage();
    dmg.addFlat(resistance);

    return dmg;
}

function calculateElementBonus(character_config, monster) {
    const element_type = getCharElementType(character_config);

    const ELEM_BONUS_TABLE = [
        [0, 0, 0, 0, 0],
        [0.3, 0.0, 1.0, 0.0, 0.5],
        [0.3, 1.0, 0.0, 0.5, 0.0],
        [0.3, 0.5, 0.0, 0.0, 2.0],
        [0.3, 0.0, 0.5, 2.0, 0.0],
    ]

    const bonus = ELEM_BONUS_TABLE[element_type][monster.element];

    let result = 1 + bonus;

    let dmg = new CalculatedDamage();
    dmg.addFlat(result);

    return dmg;
}


// Returns an instance of CalculatedDamage
function calculateMoraleDamage(character_config, monster, bonuses) {
    let result = new Damage(0, 0);

    let char_level = character_config.level;

    let morale_bonus = 0;
    if (Object.hasOwn(bonuses, 170)) {
        morale_bonus = bonuses[170].values[0];
    }

    let monster_level = monster.level;

    result.add(new Damage(char_level, char_level));
    result.add(new Damage(morale_bonus, morale_bonus));
    result.sub(new Damage(monster_level, monster_level));

    let total_dmg = new CalculatedDamage();
    total_dmg.base = result.copy();
    total_dmg.critical = result.copy();
    total_dmg.softcrit = result.copy();
    total_dmg.hardcrit = result.copy();

    return total_dmg;
}

function calculateTotalDefense(character_config, monster, bonuses) {
    const defence_upgrade_bonus = calculateDefenceUpgradeBonus(character_config, monster);
    const attack_type = character_config.skill.attack_type;

    const base_def = monster.armor[attack_type];
    const def = base_def * defence_upgrade_bonus;

    let result = new CalculatedDamage();
    result.base = new Damage(def, def);
    result.critical = new Damage(def, def);
    result.softcrit = new Damage(def, def);
    result.hardcrit = new Damage(def, def);

    return result;
}

function calculateDefenceUpgradeBonus(character_config, monster) {
    // TODO: Add attack level increase buff

    const uses_secondary_weapon = character_config.skill.uses_secondary_weapon;
    let bonus_diff = 0;

    if (uses_secondary_weapon) {
        if (character_config.offhand === undefined) {
            bonus_diff = monster.armor_upgrade;
        }
        else {
            bonus_diff = Math.max(0, monster.armor_upgrade - character_config.offhand.data.upgrade_level);
        }
    }
    else {
        if (character_config.weapon === undefined) {
            bonus_diff = monster.armor_upgrade;
        }
        else {
            bonus_diff = Math.max(0, monster.armor_upgrade - character_config.weapon.data.upgrade_level);
        }
    }

    const bonus = 1.0 + UPGRADE_BONUS_TABLE[bonus_diff];
    return bonus;
}

function calculateTotalCritical(character_config, bonuses) {
    let crit_dmg = getWeaponCritDamage(character_config);

    if (Object.hasOwn(bonuses, 51)) {
        crit_dmg += bonuses[51].values[0];
    }

    // Add bonus from SP thresholds
    if (character_config.sp !== undefined && character_config.sp_bonuses !== undefined) {
        const sp_bonuses = character_config.sp_bonuses;
        if (Object.hasOwn(sp_bonuses, 2728)) {
            crit_dmg += sp_bonuses[2728];
        }
    }
    
    crit_dmg = 1 + crit_dmg / 100.0;
    return new Damage(crit_dmg, crit_dmg);
}

function getWeaponCritDamage(character_config) {
    const uses_secondary_weapon = character_config.skill.uses_secondary_weapon;

    if (uses_secondary_weapon) {
        if (character_config.offhand === undefined) {
            return 0;
        }
        return character_config.offhand.data.crit_damage;
    }
    else {
        if (character_config.weapon === undefined) {
            return 0;
        }

        return character_config.weapon.data.crit_damage;
    }
}

function calculatePercentDamageIncrease(character_config, bonuses) {
    let result = 0;

    // Add all percent damage increase bonuses
    if (Object.hasOwn(bonuses, 441)) {
        const val = bonuses[441].values[0];
        result += val;
    }

    if (Object.hasOwn(bonuses, 1030)) {
        const val = bonuses[1030].values[0];
        result += val;
    }

    // Add specific percent damage increase bonuses
    const attack_type = character_config.skill.attack_type;
    let attack_type_bonus_id = 1031 + attack_type;

    if (Object.hasOwn(bonuses, attack_type_bonus_id)) {
        const val = bonuses[attack_type_bonus_id].values[0];
        result += val;
    }

    result = 1 + result / 100.0;

    let dmg = new CalculatedDamage();
    dmg.addFlat(result);

    return dmg;
}


