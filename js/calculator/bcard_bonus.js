export {
    getDpsBcardBonuses
}

function getDpsBcardBonuses(character_config) {
    let bonuses = {}

    const dps_buffs = [
        30,     // All attacks are increased by X
        31,     // Melee attack is increased by X
        32,     // Ranged attack is increased by X
        33,     // Magic attack is increased by X
        34,     // Attack level is increased by X

        240,    // Increases damage against X race by Y
        241,    // Critical hit chance against X is increased by Y

        70,     // Fire element is increased by X
        71,     // Water element is increased by X
        72,     // Light element is increased by X
        73,     // Shadow element is increased by X
        74,     // All element energies are increased by X

        170,    // Morale stat is increased by X

        -140,   // Reduces the enemy's elemental resistances by X
        -141,   // Reduces the enemy's fire resistance by X
        -142,   // Reduces the enemy's water resistance by X
        -143,   // Reduces the enemy's light resistance by X
        -144,   // Reduces the enemy's shadow resistance by X

        960,    // Increases the equipped fairy's element by X
        961,    // On attack there is a X% chance of increasing your equipped fairy's element by Y

        441,    // All attacks are increased by X% (from item)
        1030,   // All attacks are increased by X%
        1031,   // Melee attacks are increased by X%
        1032,   // Ranged attacks are increased by X%
        1033,   // Magic attacks are increased by X%

        50,     // Chance of inflicting critial hits is increased by X%
        51,     // Increases damage from critical hits by X%
        52,     // Increases damage with a probability of X% by Y%

        80,     // Provides a X% chance to increase attack power by Y%

        //1234,   // Increases damage to all monsters in acct 9 (excluding raids9 and the land of life by X%)
    ]

    for (const property_name in character_config) {
        const property = character_config[property_name];

        if (property === undefined)
            continue;

        if (!Object.hasOwn(property, "buffs"))
            continue;

        const buffs = property["buffs"];

        for (const buff of buffs) {
            const bcard_vnum = buff["bcard_vnum"];

            if (bcard_vnum === undefined || bcard_vnum <= 0)
                continue;

            const bcard_sub = buff["bcard_sub"];
            const values = buff["values"];

            const id = encodeBcardID(bcard_vnum, bcard_sub, Math.sign(values[0]));

            if (!dps_buffs.includes(id))
                continue;

            if (bonuses[id] === undefined) {
                bonuses[id] = {
                    bcard_vnum: bcard_vnum,
                    values: Object.assign([], values),
                    bcard_sub: bcard_sub,
                }
            }
            else {
                bonuses[id]["values"][0] += values[0];
                bonuses[id]["values"][1] += values[1];
            }
        }
    }

    return bonuses;
}

/**
 * For example:
 * bcard_vnum = 3
 * bcard_sub = 2
 * sign = -1
 * 
 * return -32
 */
function encodeBcardID(bcard_vnum, bcard_sub, sign) {
    return (bcard_vnum * 10 + bcard_sub) * sign;
}