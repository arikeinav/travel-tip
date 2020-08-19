export const locService = {
    getLocs: getLocs,
    getPosition: getPosition,
    createLocation: createLocation
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
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function createLocation(name, lat, lng) {
    locs = loadFromStorage(KEY_LOC)
    if (!locs) locs = []
    var location = {
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