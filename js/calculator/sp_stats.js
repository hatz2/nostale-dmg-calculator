
const MAX_POINTS = 100;

export function calculateAttackAddition(sp_attack_points, sp_attack_gems) {
    const gem_factor = 10;
    let added_attack = 0;

    for (let i = 0; i < sp_attack_points && i < MAX_POINTS; ++i) {
        added_attack += getAttackPointIncrement(i);
    }

    added_attack += sp_attack_gems * gem_factor;

    return added_attack;
}

function getAttackPointIncrement(level) {
    if (level < 70) {
        return Math.floor(level / 10) + 5;
    }

    if (level < 80) {
        return 13;
    }

    if (level < 90) {
        return 14;
    }

    if (level < 94) {
        return 15;
    }

    if (level < 95) {
        return 16;
    }

    if (level < 97) {
        return 17;
    }

    if (level < 100) {
        return 20;
    }

    return 0;
}

export function calculateDefenceAddition(sp_defence_points, sp_defence_gems) {
    const gem_factor = 10;
    let added_defence = 0;

    for (let i = 0; i < sp_defence_points && i < MAX_POINTS; ++i) {
        added_defence += Math.floor(i / 10) + 1;
    }

    added_defence += sp_defence_gems * gem_factor;

    return added_defence;
}

export function calculateElementAddition(sp_element_points, sp_element_gems) {
    const gem_factor = 1;
    let added_element = 0;

    for (let i = 0; i < sp_element_points && i < MAX_POINTS; ++i) {
        added_element += Math.floor(i / 50) + 1;
    }

    added_element += sp_element_gems * gem_factor;

    return added_element;
}

export function calculateHpMpAddition(sp_hpmp_points, sp_hpmp_gems) {
    const gem_factor = 100;
    let added_hpmp = 0;

    for (let i = 0; i < sp_hpmp_points && i < MAX_POINTS; ++i) {
        added_hpmp += Math.floor(i / 50) + 1;
    }

    added_hpmp += sp_hpmp_gems * gem_factor;

    return added_hpmp;
}

