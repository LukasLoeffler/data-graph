
export function headerArrayToObject(headerList) {
    let headers = {};
    headerList.forEach(header => {
        headers[header.key] = header.value;
    });
    return headers;
}