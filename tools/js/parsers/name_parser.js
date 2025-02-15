import { normalizeEOL } from "../../../js/utils.js"

export {
    NameParser,
}

/**
 * Parses the data of a lang name file
 */
class NameParser {
    #data

    constructor(data) {
        this.#data = normalizeEOL(data);
        this.#replaceCaretWithSpace();
    }

    /**
     * @returns A map with name id as keys and the name as value
     */
    parse() {
        const names = new Map();
        const entries = this.#splitIntoEntries();

        entries.forEach(entry => {
            const entry_data = NameEntry.fromRow(entry);
            names.set(entry_data.getId(), entry_data.getName());
        });

        return names;
    }

    #splitIntoEntries() {
        return this.#data.split('\n').filter(Boolean);
    }

    #replaceCaretWithSpace() {
        this.#data = this.#data.replaceAll("^", " ");
    }
}

/**
 * Represents each row of the file
 */
class NameEntry {
    #splitted_entry

    constructor(splitted_entry) {
        this.#splitted_entry = splitted_entry;
    }

    static fromRow(entry) {
        return new NameEntry(this.#splitEntry(entry));
    }

    static #splitEntry(entry) {
        return entry.split('\t').filter(Boolean);
    }

    getId() {
        return this.#splitted_entry[0];
    }
    
    getName() {
        return this.#splitted_entry[1];
    }
}