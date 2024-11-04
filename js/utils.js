export function normalizeEOL(data) {
    return data.replace(/\r\n?/g, '\n');
}