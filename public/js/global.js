var fromEncoded = function (encoded, options) {
    var coords = decode(encoded);
    return L.polyline(coords, options);
}

var decode = function (str, precision) {
    var index = 0, lat = 0, lng = 0, coordinates = [], factor = Math.pow(10, precision || 5);

    while (index < str.length) {
        var b, shift = 0, result = 0;
        do {
            b = str.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = str.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
}