import { character_config } from "../calculator/character_config.js";

export function initClassSwapRadioButtons() {
    const radio_btns = document.querySelectorAll('input[name="character_class"]');

    radio_btns.forEach((radio) => {
        radio.addEventListener("change", onClassRadioBtnChanged);
    });
}

function onClassRadioBtnChanged(event) {
    character_config.clear();
    clearCharacterSlotWidgets();
}

function clearCharacterSlotWidgets() {
    const char_slot_imgs = document.getElementsByClassName("weared-item");

    Array.from(char_slot_imgs).forEach((img) => {
        img.setAttribute("title", "");
        img.setAttribute("src", `imgs/ui/char_slot_placeholder.png`);
    });
}