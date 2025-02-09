import { character_config } from "../calculator/character_config.js";

export {
    initStatsTab,
}

function initStatsTab() {
    const stats_tab = document.getElementById("stats-tab-btn");
    stats_tab.onclick = function(event) {
        switchTab(event, "stats-tab");
    }
    stats_tab.click();

    const dmg_mod_tab_btn = document.getElementById("dmg-mod-tab-btn");
    dmg_mod_tab_btn.onclick = function(event) {
        switchTab(event, "buff-widget");
    }

    document.getElementById("character-level").addEventListener("input", onLevelChanged);

    document.getElementById("base-dmg").addEventListener("input", onBaseDmgChanged);
}

function switchTab(event, tab_name) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tab_name).style.display = "block";
    event.currentTarget.className += " active";
  }


function onLevelChanged(event) {
    const level = this.value;
    character_config.level = parseInt(level);
}

function onBaseDmgChanged(event) {
    const base_dmg = this.value;
    character_config.base_dmg = parseInt(base_dmg);
}