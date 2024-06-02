var lineDirection = $('#lineDirection');
var direction = $('#direction');
var tramIDOutput = $('#tramIDOutput');
var searchButton = $('#searchButton');
var map = L.map("map").setView([38.7219, 35.4874], 13);

const directionLabels = {
    "ARRIVAL": {
        "T1": "Organize - İldem",
        "T2": "Cumhuriyet - Cemil Baba",
        "T3": "Kumsmall - İldem",
        "T4": "Cumhuriyet - Anayurt",
    },
    "DEPARTURE": {
        "T1": "İldem - Organize",
        "T2": "Cemil Baba - Cumhuriyet",
        "T3": "İldem - Kumsmall",
        "T4": "Anayurt - Cumhuriyet",
    }
}

var updateLabels = function () {
    let selectedDirection = direction.val();
    let currentOptions = lineDirection.find('option');
    let changeTo = directionLabels[selectedDirection];

    currentOptions.each(function(index, option) {
        let tramID = $(option).val();
        $(option).text(changeTo[tramID]);
    });
}

function findTrams() {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });

    let tramLineCode = tramIDOutput.attr('value');
    let selectedDirection = direction.val();

    $.ajax({
        type: "POST",
        url: "/api/tram",
        data: {
            tramLineCode: tramLineCode,
            direction: selectedDirection
        },
        success: function(data) {
            //TODO let trams = data.trams;
            addLocations(data.tramstops);
            var routes = fromEncoded(data.routes.routes[0].geometry, {
                color: "blue",
            }).addTo(map);
            map.fitBounds(routes.getBounds());
        }
    });
}

function addLocations(tramstops) {
    tramstops.forEach(tramstop => {
        addLocation(tramstop);
    });
}

function addLocation(tramstop) {
    var marker = L.marker([tramstop.latitude, tramstop.longitude]).addTo(map);
    
    marker.bindPopup(`
    <h5>
        <b>${tramstop.code}</b> ${tramstop.name}
    </h5> <br />
    <span>
        <a href="/tramstops/${tramstop.code}">
            Geçen tramvayları gör
        </a>
    </span>`, { autoClose: true });
}

direction.on('change', () => {
    updateLabels();
    findTrams();
});

lineDirection.on('change', () => {
    tramIDOutput.attr('value', lineDirection.val())
    findTrams();
})

searchButton.on('click', () => {
    findTrams();
})

updateLabels();

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
}).addTo(map);
