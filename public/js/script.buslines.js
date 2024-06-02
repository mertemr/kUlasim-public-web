var map = L.map("map").setView([38.7219, 35.4874], 13);
var busNumberInput = $("#busNumber");
var directionInput = $("#direction");
var busNameOutput = $("#busName");

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
}).addTo(map);

$(
    "#map > div.leaflet-control-container > div.leaflet-bottom.leaflet-right > div > a"
).hide();

$("#searchButton").on("click", function () {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
        }
    });
    busNameOutput.attr("placeholder", "");
    performSearch();
});

var performSearch = function (){
    $.ajax({
        url: "/api/bus",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            busNumber: busNumberInput.val(),
            direction: directionInput.val(),
        }),
        success: (data) => {
            busNameOutput.attr("placeholder", data.name);
            addLocations(data.busstops);
            var routes = fromEncoded(data.routes.routes[0].geometry, {
                color: "blue",
            }).addTo(map);
            map.fitBounds(routes.getBounds());
        }
    });
}

function addLocation(busstop) {
    var marker = L.marker([busstop.latitude, busstop.longitude]).addTo(map);
    
    marker.bindPopup(`
    <h5>
        <b>${busstop.code}</b> ${busstop.name}
    </h5> <br />
    <span>
        <a href="/busses/${busstop.code}">
            Geçen otobüsleri gör
        </a>
    </span>`, { autoClose: true });
}

function addLocations(busstops) {
    busstops.forEach((busstop) => {
        addLocation(busstop);
    });
}