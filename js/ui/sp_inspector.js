import { character_config } from "../calculator/character_config.js";


export function initSpInspector() {
    initInputBindings();
    initButtonBindings();
    initContextMenu();
}

function initInputBindings() {
    const attack = document.getElementById("attack-points");
    const defence = document.getElementById("defence-points");
    const element = document.getElementById("element-points");
    const hp_mp = document.getElementById("hp-mp-points");

    const attack_perf = document.getElementById("attack-perf");
    const defence_perf = document.getElementById("defence-perf");
    const element_perf = document.getElementById("element-perf");
    const hp_mp_perf = document.getElementById("hp-mp-perf");

    attack.addEventListener("click", setAttackPoints);
    defence.addEventListener("click", setDefencePoints);
    element.addEventListener("click", setElementPoints);
    hp_mp.addEventListener("click", setHpMpPoints);

    attack_perf.addEventListener("click", setAttackPerf);
    defence_perf.addEventListener("click", setDefencePerf);
    element_perf.addEventListener("click", setElementPerf);
    hp_mp_perf.addEventListener("click", setHpMpPerf);
}

function setAttackPoints() {
    character_config.sp_config.attack = this.value;
}

function setDefencePoints() {
    character_config.sp_config.defence = this.value;
}

function setElementPoints() {
    character_config.sp_config.element = this.value;
}

function setHpMpPoints() {
    character_config.sp_config.hp_mp = this.value;
}

function setAttackPerf() {
    character_config.sp_config.attack_perf = this.value;
}

function setDefencePerf() {
    character_config.sp_config.defence_perf = this.value;
}

function setElementPerf() {
    character_config.sp_config.element = this.value;
}

function setHpMpPerf() {
    character_config.sp_config.hp_mp_perf = this.value;
}

function initButtonBindings() {
    const cross_btn = document.getElementById("sp-cross-close-btn")
    cross_btn.addEventListener("click", hideSpInspector);

    const reset_btn = document.getElementById("reset-points-btn");
    reset_btn.addEventListener("click", resetFields);

    const close_btn = document.getElementById("sp-close-blue-btn");
    close_btn.addEventListener("click", hideSpInspector);
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
}