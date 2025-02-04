const IDLE_ANIMATION = 10
const IMG_FOLDER = "/imgs/full_monster_sprites/"

export {
    getIdleMonsterImgPaths
}

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