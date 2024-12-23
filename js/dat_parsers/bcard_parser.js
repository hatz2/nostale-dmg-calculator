import { DatObject, DatParser, DatRow } from "./dat_parser.js";

export class BCard extends DatObject {
    constructor(
        vnum, 
        name,
        desc,
    ) {
        super(vnum, name);

        this.subj = new Array(5);
        this.list = new Array(5);

        for (let i = 0; i < 5; ++i) {
            this.list[i] = new Array(2);
        }

        this.desc = desc;
    }
}

export class BCardDatParser extends DatParser {
    constructor(data, names_map) {
        const row_parsers = {
            "VNUM": VnumRow,
            "NAME": NameRow,
            "DESC": DescRow,
            "SUBJ1": SubjRow,
            "SUBJ2": SubjRow,
            "SUBJ3": SubjRow,
            "SUBJ4": SubjRow,
            "SUBJ5": SubjRow,
            "LIST1-1": ListRow,
            "LIST1-2": ListRow,
            "LIST2-1": ListRow,
            "LIST2-2": ListRow,
            "LIST3-1": ListRow,
            "LIST3-2": ListRow,
            "LIST4-1": ListRow,
            "LIST4-2": ListRow,
            "LIST5-1": ListRow,
            "LIST5-2": ListRow,
        }

        super(data, names_map, row_parsers, BCard);
    }

    parse() {
        let result = super.parse();
        result = this.#replaceSubjNames(result);
        result = this.#replaceListNames(result);
        return result;
    }

    #replaceSubjNames(collection) {
        const names = this.getNamesMap();

        collection.forEach(obj => {

            for (let i = 0; i < obj.subj.length; ++i) {
                const code_name = obj.subj[i];
                const name = names.get(code_name);
    
                obj.subj[i] = name;
            }
        });

        return collection;
    }

    #replaceListNames(collection) {
        const names = this.getNamesMap();

        collection.forEach(obj => {

            for (let i = 0; i < obj.list.length; ++i) {
                for (let j = 0; j < obj.list[0].length; ++j) {
                    const code_name = obj.list[i][j];
                    const name = names.get(code_name);
        
                    obj.list[i][j] = name;
                }
            }
        });

        return collection;
    }
}

class VnumRow extends DatRow {
    applyTo(obj) {
        obj.vnum = this.getVnum();
    }

    getVnum() {
        return parseInt(this.get(1));
    }
}

class NameRow extends DatRow {
    applyTo(obj) {
        obj.name = this.getCodeName();
    }

    getCodeName() {
        return this.get(1);
    }
}

class DescRow extends DatRow {
    applyTo(obj) {
        obj.desc = [
            this.get(1), 
            this.get(2), 
            this.get(3), 
            this.get(4), 
            this.get(5)
        ];
    }
}

class SubjRow extends DatRow {
    applyTo(obj) {
        obj.subj[this.getIndexFromHeader()] = this.getCodeName();
    }

    getIndexFromHeader() {
        const header = this.getHeader();
        return parseInt(header.slice(-1)) - 1;
    }

    getCodeName() {
        return this.get(1);
    }
}

class ListRow extends DatRow {
    applyTo(obj) {
        obj.list[this.getIndexFromHeader(-3)][this.getIndexFromHeader(-1)] = this.getCodeName();
    }

    getIndexFromHeader(offset) {
        const header = this.getHeader();
        const index = parseInt(header.slice(offset)) - 1;
        return index;
    }

    getCodeName() {
        return this.get(1);
    }
}