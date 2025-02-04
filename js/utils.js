export {
    normalizeEOL,
    formatString
}

function normalizeEOL(data) {
    return data.replace(/\r\n?/g, '\n');
}

function formatString(template, values) {
    let i = 0;
    return template.replace(/%s/g, () => values[i++]).replace(/%%/g, "%");
}