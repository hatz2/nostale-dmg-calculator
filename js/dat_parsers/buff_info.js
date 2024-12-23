export class BuffInfo {
    constructor(
        bcard_vnum,
        values,
        bcard_sub,
        target
    ) {
        this.bcard_vnum = bcard_vnum;
        this.values = values; // array of size 2
        this.bcard_sub = bcard_sub;
        this.target = target;
    }
}