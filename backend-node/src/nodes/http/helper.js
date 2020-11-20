
module.exports = {
    buildHeader: headerArrayToObject,
};


// Written in JS because TS restrictions dont allow such easy conversions
function headerArrayToObject(headerList) {
    let headers = {};
    headerList.forEach(header => {
        headers[header.key] = header.value;
    });
    return headers;
}