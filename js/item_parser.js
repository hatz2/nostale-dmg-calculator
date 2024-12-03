import { AttackType } from "./enums.js"
import { normalizeEOL } from "./utils.js";
import { getDatEntries } from "./dat_entry_parser.js";
import { DatObject, EntryParser, DatParser, DatRow } from "./dat_parser.js";

export {
    Item,
    ItemDatParser,
}

// TODO: Add orange buff efects
class Item extends DatObject {
    constructor(vnum, name, inventory_tab, item_type, item_subtype, eq_slot, icon_id, attack_type, required_class) {
        super(vnum, name);

        this.inventory_tab = inventory_tab;
        this.item_type = item_type;
        this.item_subtype = item_subtype;
        this.eq_slot = eq_slot;
        this.icon_id = icon_id;
        this.attack_type = attack_type;
        this.required_class = required_class;
    }
}

class ItemDatParser extends DatParser {
    constructor(data, names_map) {
        super(data, names_map, ItemEntryParser)
    }
}

class ItemEntryParser extends EntryParser {
    constructor(entry) {
        super(entry);
    }

    parse() {
        // TODO: implementation
    }
}
