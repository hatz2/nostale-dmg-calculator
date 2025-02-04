import { AttackType } from "../../../js/enums.js";

export {
    MonsterDefenceStatCalculator
}

/**
 * Calculator to get the real defence stats of a monster
 * Taken from NosWings leaked project aka Vanosilla
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