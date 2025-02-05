import { character_config } from "../calculator/character_config.js";
import { calculateAttackAddition, calculateDefenceAddition, calculateElementAddition, calculateHpMpAddition } from "../calculator/sp_stats.js";
import { calculate_bonus_from_sp, get_str_array_from_bonuses } from "../calculator/sp_bonus.js";

export function initSpInspector() {
    initInputBindings();
    initButtonBindings();
    initContextMenu();
}

const SP_BONUS_SCROLL_STEP = 14.5;

function initInputBindings() {
    const attack = document.getElementById("attack-points");
    const defence = document.getElementById("defence-points");
    const element = document.getElementById("element-points");
    const hp_mp = document.getElementById("hp-mp-points");

    const attack_perf = document.getElementById("attack-perf");
    const defence_perf = document.getElementById("defence-perf");
    const element_perf = document.getElementById("element-perf");
    const hp_mp_perf = document.getElementById("hp-mp-perf");

    attack.addEventListener("input", setAttackPoints);
    defence.addEventListener("input", setDefencePoints);
    element.addEventListener("input", setElementPoints);
    hp_mp.addEventListener("input", setHpMpPoints);

    attack_perf.addEventListener("input", setAttackPerf);
    defence_perf.addEventListener("input", setDefencePerf);
    element_perf.addEventListener("input", setElementPerf);
    hp_mp_perf.addEventListener("input", setHpMpPerf);
}

function setAttackPoints() {
    character_config.sp_config.attack = this.value;
    character_config.sp_bonuses = calculate_bonus_from_sp(character_config.sp_config);
    showAttackIncrease();
    showSpBonuses();
}

function setDefencePoints() {
    character_config.sp_config.defence = this.value;
    character_config.sp_bonuses = calculate_bonus_from_sp(character_config.sp_config);
    showDefenceIncrease();
    showSpBonuses();
}

function setElementPoints() {
    character_config.sp_config.element = this.value;
    character_config.sp_bonuses = calculate_bonus_from_sp(character_config.sp_config);
    showElementIncrease();
    showSpBonuses();
}

function setHpMpPoints() {
    character_config.sp_config.hp_mp = this.value;
    character_config.sp_bonuses = calculate_bonus_from_sp(character_config.sp_config);
    showHpMpIncrease();
    showSpBonuses();
}

function setAttackPerf() {
    character_config.sp_config.attack_perf = this.value;
    showAttackIncrease();
}

function setDefencePerf() {
    character_config.sp_config.defence_perf = this.value;
    showDefenceIncrease();
}

function setElementPerf() {
    character_config.sp_config.element_perf = this.value;
    showElementIncrease();
}

function setHpMpPerf() {
    character_config.sp_config.hp_mp_perf = this.value;
    showHpMpIncrease();
}

function showAttackIncrease() {
    document.getElementById("sp-attack").innerText = `+ ${
        calculateAttackAddition(
            character_config.sp_config.attack, 
            character_config.sp_config.attack_perf
        )
    }`;
}

function showDefenceIncrease() {
    document.getElementById("sp-defence").innerText = `+ ${
        calculateDefenceAddition(
            character_config.sp_config.defence,
            character_config.sp_config.defence_perf
        )
    }`;
}

function showElementIncrease() {
    document.getElementById("sp-element").innerText = `+ ${
        calculateElementAddition(
            character_config.sp_config.element,
            character_config.sp_config.element_perf
        )
    }`;
}

function showHpMpIncrease() {
    document.getElementById("sp-hpmp").innerText = `+ ${
        calculateHpMpAddition(
            character_config.sp_config.hp_mp,
            character_config.sp_config.hp_mp_perf
        )
    }`;
}

function showSpBonuses() {
    let bonuses = character_config.sp_bonuses;
    const sp_bonus_display = document.getElementById("sp-bonus-display");
    const str_bonuses = get_str_array_from_bonuses(bonuses);

    let full_text = "";

    for (let str_bonus of str_bonuses) {
        full_text += str_bonus + "<br>";
    }

    sp_bonus_display.innerHTML = full_text;
}

function initButtonBindings() {
    const cross_btn = document.getElementById("sp-cross-close-btn")
    cross_btn.addEventListener("click", hideSpInspector);

    const reset_btn = document.getElementById("reset-points-btn");
    reset_btn.addEventListener("click", resetFields);

    const close_btn = document.getElementById("sp-close-blue-btn");
    close_btn.addEventListener("click", hideSpInspector);

    const scroll_up_btn = document.getElementById("sp-bonus-scroll-up-btn");
    scroll_up_btn.addEventListener("click", scrollUp);
    
    const scroll_down_btn = document.getElementById("sp-bonus-scroll-down-btn");
    scroll_down_btn.addEventListener("click", scrollDown);
}

export function hideSpInspector() {
    const widget = document.getElementById("sp-point-inspector");
    widget.style.visibility = "hidden";
    widget.style.opacity = 0;
}

function initContextMenu() {
    const sp_img = document.querySelector(`.weared-item[eqslot="12"]`);
    sp_img.addEventListener("contextmenu", onContextMenu);
}

function onContextMenu(event) {
    event.preventDefault();

    if (character_config.sp === undefined)
        return;

    loadCurrentSpConfig();
    moveToCurrentMousePosition(event);
    showSpInspector();
}

function loadCurrentSpConfig() {
    const attack = document.getElementById("attack-points");
    const defence = document.getElementById("defence-points");
    const element = document.getElementById("element-points");
    const hp_mp = document.getElementById("hp-mp-points");
    const attack_perf = document.getElementById("attack-perf");
    const defence_perf = document.getElementById("defence-perf");
    const element_perf = document.getElementById("element-perf");
    const hp_mp_perf = document.getElementById("hp-mp-perf");
    const sp_title = document.getElementById("sp-title");

    attack.setAttribute("value", character_config.sp_config.attack);
    defence.setAttribute("value", character_config.sp_config.defence);
    element.setAttribute("value", character_config.sp_config.element);
    hp_mp.setAttribute("value", character_config.sp_config.hp_mp);
    attack_perf.setAttribute("value", character_config.sp_config.attack_perf);
    defence_perf.setAttribute("value", character_config.sp_config.defence_perf);
    element_perf.setAttribute("value", character_config.sp_config.element_perf);
    hp_mp_perf.setAttribute("value", character_config.sp_config.hp_mp_perf);
    sp_title.innerText = character_config.sp.name.replace("Specialist Card", "");
}

function moveToCurrentMousePosition(event) {
    const widget = document.getElementById("sp-point-inspector");
    widget.style.top = event.pageY + "px";
    widget.style.left = event.pageX + "px";
}

function showSpInspector() {
    const widget = document.getElementById("sp-point-inspector");
    widget.style.visibility = "visible";
    widget.style.opacity = 1; 
}

function resetFields() {
    document.getElementById("attack-points").value = 0;
    document.getElementById("defence-points").value = 0;
    document.getElementById("element-points").value = 0;
    document.getElementById("hp-mp-points").value = 0;
    document.getElementById("attack-perf").value = 0;
    document.getElementById("defence-perf").value = 0;
    document.getElementById("element-perf").value = 0;
    document.getElementById("hp-mp-perf").value = 0;
    document.getElementById("sp-title").value = 0;

    character_config.sp_config.resetFields();
    showSpBonuses();
}

function scrollUp() {
    const sp_bonus_display = document.getElementById("sp-bonus-display");

    sp_bonus_display.scrollTo({
        top: sp_bonus_display.scrollTop - SP_BONUS_SCROLL_STEP,
        behavior: "smooth"
    });
}

function scrollDown() {
    const sp_bonus_display = document.getElementById("sp-bonus-display");

    sp_bonus_display.scrollTo({
        top: sp_bonus_display.scrollTop + SP_BONUS_SCROLL_STEP,
        behavior: "smooth"
    });
}