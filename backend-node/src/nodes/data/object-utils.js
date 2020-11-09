module.exports = {
    getValue: getValue,
    setValue: setValue
};

// Written in JS because type-safety of ts would not allow such dynamic concepts

//https://stackoverflow.com/a/20240290/10797372
function setValue(obj, path, value) {
    var a = path.split('.')
    var o = obj
    while (a.length - 1) {
        var n = a.shift()
        if (!(n in o)) o[n] = {}
        o = o[n]
    }
    o[a[0]] = value
}

//https://stackoverflow.com/a/20240290/10797372
function getValue(obj, path) {
    path = path.replace(/\[(\w+)\]/g, '.$1')
    path = path.replace(/^\./, '')
    var a = path.split('.')
    var o = obj
    while (a.length) {
        var n = a.shift()
        if (!(n in o)) return
        o = o[n]
    }
    return o
}