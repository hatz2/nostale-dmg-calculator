import { normalizeEOL } from "./utils.js";

export {
    DatObject,
    EntryParser,
    DatParser,
    DatRow,
}

class DatObject {
    constructor(vnum, name) {
        this.vnum = vnum;
        this.name = name;
    }
}

class EntryParser {
    constructor(entry) {
        this.splitted_entry = this.#splitEntry(entry);
    }

    #splitEntry(entry) {
        return entry.split("\n").filter(Boolean);
    }

    
    parse() {
        // Reimplemented in child objects
    }
}

class DatParser {
    #data
    #names
    #EntryParser

    constructor(data, names, EntryParser) {
        this.#data = normalizeEOL(data);
        this.#names = names;
        this.#EntryParser = EntryParser;
    }

    parse() {
        const entries = this.#splitDataIntoEntries();
        const objects = this.#parseEntries(entries);
        return this.#replaceNameIdsWithName(objects);
    }

    #splitDataIntoEntries() {
        const entries = this.#data.split("#========================================================\n");
        // Remove empty entries (usually the ones between two separators)
        return entries.filter(Boolean);
    }

    #parseEntries(entries) {
        const objects = [];

        entries.forEach(entry => {
            const entry_parser = new this.#EntryParser(entry);
            const obj = entry_parser.parse();
            objects.push(obj);
        });

        return objects;
    }

    #replaceNameIdsWithName(objects) {
        objects.forEach(object => {
            if (object.name !== undefined) {
                object.name = this.#names.get(object.name)
            }
        })

        return objects;
    }
}

class DatRow {
    #splitted_row

    constructor(row) {
        this.#splitted_row = this.#splitEntryRow(row);
    }

    #splitEntryRow(row) {
        return row.split("\t").filter(Boolean);
    }

    // Read properties from row and store them in obj
    applyTo(obj) {
        // Reimplemented in children classes
    }

    getHeader() {
        return this.get(0);
    }

    get(index) {
        return this.#splitted_row[index];
    }

}



