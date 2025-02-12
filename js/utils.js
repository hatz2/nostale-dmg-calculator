export {
    normalizeEOL,
    formatString,
    getIdleMonsterImgPaths
}

function normalizeEOL(data) {
    return data.replace(/\r\n?/g, '\n');
}

function formatString(template, values) {
    let i = 0;
    return template.replace(/%s/g, () => values[i++]).replace(/%%/g, "%");
}

const IDLE_ANIMATION = 10
const IMG_FOLDER = "/imgs/full_monster_sprites/"

function getIdleMonsterImgPaths(sprite_info_array) {
    const result = new Map()

    sprite_info_array.forEach(element => {
        // We care about idle animations only
        if (element.animation != IDLE_ANIMATION) {
            return;
        }

        if ((element.direction == 0 && !result.has(element.monster)) || element.direction == 2) {
            result.set(
                element.monster, 
                `${IMG_FOLDER}${element.monster}_${IDLE_ANIMATION}_${element.direction}.webp`
            )
        }
    });

    return result;
}