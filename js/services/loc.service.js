export const locService = {
    getLocs,
    getPosition,
    createLocation,
    removeItem,
    getLocationLatLng
}
const KEY_LOC = 'locations'
var locs;

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function createLocation(name, lat, lng) {
    locs = loadFromStorage(KEY_LOC)
    if (!locs) locs = []
    var location = {
        id: makeId(),
        locationName: name,
        lat,
        lng
    }
    locs.push(location)
    _saveLocalsToStorage()
}

function _saveLocalsToStorage() {
    saveToStorage(KEY_LOC, locs)

}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}

function makeId(length = 3) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return txt;
}


function removeItem(itemId) {
    // const idx = gItems.findIndex(item => item.id === itemId)
    // gItems.splice(idx, 1)
    locs = locs.filter(item => item.id !== itemId)
    _saveLocalsToStorage()

    return Promise.resolve(locs)
}

function getLocationLatLng(itemId) {
    let loc = locs.find(location => location.id === itemId)
    return Promise.resolve(loc)


}