import {BCardDatParser} from './parsers/dat/bcard_parser.js'
import {ItemDatParser} from './parsers/dat/item_parser.js'
import {MonsterDatParser} from './parsers/dat/monster_parser.js';
import {SkillDatParser} from './parsers/dat/skill_parser.js'
import {NameParser} from './parsers/name_parser.js';
import fs from 'fs';


function readNamesMapFromFile(path) {
    const lang_file = fs.readFileSync(path, 'ascii');
    const parser = new NameParser(lang_file);
    return parser.parse();
}

function initDatObjCollection(path, names_map, ParserTemplate, ...additional_params) {
    const dat_file = fs.readFileSync(path, 'ascii');
    const parser = new ParserTemplate(dat_file, names_map, additional_params);
    return parser.parse();
}

// Monster DAT
const monsterNames = readNamesMapFromFile("../../../client_files/lang/_code_uk_monster.txt");
const monsters = initDatObjCollection("../../../client_files/dat/monster.dat", monsterNames, MonsterDatParser);
fs.writeFileSync("../../../data/monster.json", JSON.stringify(monsters, null, 4), );

// Item DAT
const itemNames = readNamesMapFromFile("../../../client_files/lang/_code_uk_Item.txt");
const items = initDatObjCollection("../../../client_files/dat/Item.dat", itemNames, ItemDatParser);
fs.writeFileSync("../../../data/item.json", JSON.stringify(items, null, 4));

// BCard DAT
const bcardNames = readNamesMapFromFile("../../../client_files/lang/_code_uk_BCard.txt");
const bcards = initDatObjCollection("../../../client_files/dat/BCard.dat", bcardNames, BCardDatParser);
fs.writeFileSync("../../../data/bcard.json", JSON.stringify(bcards, null, 4));

// Skill DAT
const skillNames = readNamesMapFromFile("../../../client_files/lang/_code_uk_Skill.txt");
const skills = initDatObjCollection("../../../client_files/dat/Skill.dat", skillNames, SkillDatParser);
fs.writeFileSync("../../../data/skill.json", JSON.stringify(skills, null, 4));



