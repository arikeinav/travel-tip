import { locService } from './services/loc.service.js'

var map;


window.onload = () => {
    initMap()
        .then(() => {

            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    locService.getPosition()
        .then(pos => {

            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('Cannot get user-position', err);
        })
}

document.querySelector('.btn').addEventListener('click', (ev) => {
    console.log('Aha!', ev.target);
    panTo(35.6895, 139.6917);
})

export function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            map = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            console.log('Map!', map);
        })
        .then(() => {
            google.maps.event.addListener(map, 'click', function(e) {
                var latitude = e.latLng.lat();
                var longitude = e.latLng.lng();
                addMarker(e.latLng)
                var location = toggleMenu();
                // var location = prompt('please enter the location name')
                if (!location) return
                locService.createLocation(location, latitude, longitude)
                locService.getLocs()
                    .then(locs => renderLocations(locs))

            })
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: map,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    map.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyAYaRzZVw0et6KwDpRWmxDwiFk-2CWXKts'
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}









function renderLocations(locs) {

    var strHtml = locs.map(function(location) {
        return `<li class="location">${location.locationName}</li>`
    })
    console.log(locs)
    document.querySelector('.locations').innerHTML += strHtml.join('')

}