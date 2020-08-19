import { locService } from './services/loc.service.js'

var map;
var userPos;


window.onload = () => {
    initMap()
        .then(() => {

            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    locService.getPosition()
        .then(pos => {
            userPos = pos.coords
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('Cannot get user-position', err);
        })
}

document.querySelector('.my-location-btn').addEventListener('click', (ev) => {
    addMarker({ lat: userPos.latitude, lng: userPos.longitude })
    panTo(userPos.latitude, userPos.longitude);
})

function initMap(lat = 32.0749831, lng = 34.9120554) {
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
        title: loc.locationName
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
        return `<li class="location">${location.locationName}
        <button class="btn-delete" data-id="${location.id}">x</button>
        <button class="btn-go-to" data-id="${location.id}">Go</button>
        </li>`
    })
    document.querySelector('.locations').innerHTML = strHtml.join('')
    addEvenetListeners()

}



function addEvenetListeners() {
    document.querySelector('.locations').onclick = function(ev) {
        if (!ev.target.dataset.id) return;
        const itemId = ev.target.dataset.id;
        if (ev.target.classList.contains('btn-delete')) {
            locService.removeItem(itemId)
                .then(renderLocations)
        } else if (ev.target.classList.contains('btn-go-to')) {
            locService.getLocationLatLng(itemId)
                .then(loc => {
                    panTo(loc.lat, loc.lng)
                    addMarker({ lat: loc.lat, lng: loc.lng })
                })
        }

    }
}