import { normalizeEOL } from "../../utils.js";

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

class DatParser {
    #data
    #names
    #row_parsers
    #obj_class

    /**
     * 
     * @param {*} data Text read from disk file
     * @param {*} names A map from code names to readable names
     * @param {*} row_parsers A map from keys like VNUM to row class parsers
     * @param {*} obj_class A data class to store info
     */
    constructor(data, names, row_parsers, obj_class) {
        this.#data = normalizeEOL(data);
        this.#removeLastDatElement();
        this.#names = names;
        this.#row_parsers = row_parsers;
        this.#obj_class = obj_class
    }

    #removeLastDatElement() {
        this.#data = this.#data.substring(0, this.#data.lastIndexOf("~"));
    }

    parse() {
        const entries = this.#splitDataIntoEntries();
        const objects = this.#parseEntries(entries);
        return this.#replaceNameIdsWithName(objects);
    }
    
    getNamesMap() {
        return this.#names;
    }

    #splitDataIntoEntries() {
        const entries = this.#data.split(/#=+\n/);
        // Remove empty entries (usually the ones between two separators)
        return entries.filter(Boolean);
    }

    #parseEntries(entries) {
        const objects = [];

        entries.forEach(entry => {
            const entry_parser = new EntryParser(entry, this.#row_parsers, this.#obj_class);
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

class EntryParser {
    // row_parsers is a map from opcodes like VNUM to their row parser class
    constructor(entry, row_parsers, obj_class) {
        this.splitted_entry = this.#splitEntry(entry);
        this.row_parsers = row_parsers;
        this.obj_class = obj_class;
    }

    #splitEntry(entry) {
        return entry.split("\n").filter(Boolean);
    }

    
    parse() {
        const obj = new this.obj_class();
        
        this.splitted_entry.forEach(row_data => {
            const row = new DatRow(row_data);
            const header = row.getHeader();
            const RowClass = this.row_parsers[header];

            if (RowClass) {
                const row_instance = new RowClass(row_data);
                row_instance.applyTo(obj);
            }
        });

        return obj;
    }
}

class DatRow {
    #splitted_row

    constructor(row) {
        this.#splitted_row = this.#splitEntryRow(row);
    }

    #splitEntryRow(row) {
        return row.split(/[\t\ ]/).filter(Boolean);
    }

    // Read properties from row and store them in obj
    applyTo(obj) {
        // Reimplemented in children classes
    }

    getHeader() {
        return this.get(0);
    }

    getSize() {
        return this.#splitted_row.length;
    }

    get(index) {
        return this.#splitted_row[index];
    }

    getInt(index) {
        return parseInt(this.#splitted_row[index]);
    }
}



