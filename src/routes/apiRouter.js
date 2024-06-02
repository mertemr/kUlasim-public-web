const { Router } = require("express");
const body_parser = require("body-parser");

API_HOST = process.env.API_HOST || "localhost";
API_PORT = process.env.API_PORT || 8002;

const apiRouter = Router();

apiRouter.use(body_parser.json());

function get_request(endpoint, callback) {
    fetch(`http://${API_HOST}:${API_PORT}${endpoint}`)
        .then((res) => res.json())
        .then((data) => callback(data))
        .catch((err) => callback({ error: err }));
}

function getRoutes(coords) {
    return new Promise((resolve, reject) => {
        fetch("https://api.openrouteservice.org/v2/directions/driving-car", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.OPENROUTE_SERVICE_API,
            },
            body: JSON.stringify({
                coordinates: coords,
                language: "tr-tr",
                units: "km",
                geometry_simplify: true,
                continue_straight: true,
            }),
        })
            .then((res) => res.json())
            .then((data) => {resolve(data)})
            .catch((err) => reject(err));
    });
}

function busname(code) {
    return new Promise((resolve, reject) => {
        get_request(`/busname/?code=${code}`, (data) => {
            if (data && data.name) {
                resolve(data.name);
            } else {
                reject('Bus not found');
            }
        });
    });
}

function tramid(query) {
    return new Promise((resolve, reject) => {
        get_request(`/tramid/?query=${query}`, (data) => {
            if (data) {
                resolve(data);
            } else {
                reject('Tram not found');
            }
        });
    });
}

function getTramStop(tram_uuid) {
    return new Promise((resolve, reject) => {
        get_request(`/tram/?id=${tram_uuid}`, (data) => {
            if (data) {
                resolve(data);
            } else {
                reject();
            }
        });
    });
}

apiRouter.post("/search", (req, res) => {
    const { text } = req.body;
    get_request(`/search/?query=${text}`, (data) => {
        res.json(data);
    });
});

apiRouter.post("/bus", async (req, res) => {
    const { busNumber, direction } = req.body;

    try {
        let busName = await busname(busNumber);

        get_request(`/bus/?id=${busNumber}&direction=${direction}`, (data) => {
            let coords = []
            let busses = []
            data.forEach(b => {
                coords.push([b.longitude, b.latitude]);
                if (b.busses) {
                    busses.push([b.busses.door_no ,b.longitude, b.latitude]);
                }
            });
            getRoutes(coords).then((routes) => {
                res.json({ name: busName, busstops: data, routes: routes, busses: busses});
            });
        });
    } catch (error) {
        res.json({ error: "Bus not found" });
    }
});

apiRouter.post("/busstop", (req, res) => {
    const { busStopCode } = req.body;
    get_request(`/busstop/?id=${busStopCode}`, (data) => {
        res.json(data);
    });
});

apiRouter.post("/tramstop", async (req, res) => {
    const { query } = req.body;

    const tramData = [];

    try {
        let stops = await tramid(query);
        
        let index = 0;
        for (const tram of stops) {
            let data = await getTramStop(tram.tram_uuid);
            tramData.push({ tramStop: stops[index], trams: data });
            index++;
        }
        res.json(tramData);
    } catch (error) {
        res.json({ error: "Tram not found" });
    }
});

apiRouter.post("/timetable", (req, res) => {
    const { busCode } = req.body;
    get_request(`/timetable/?id=${busCode}`, (data) => {
        res.json(data);
    });
});

apiRouter.post("/tram", async (req, res) => {
    const { tramLineCode, direction } = req.body;
    try {
        get_request(`/tramline/?id=${tramLineCode}&direction=${direction}`, (data) => {
            let coords = []
            let trams = []
            if (data.error) {
                res.json(data);
                return;
            }
            data.forEach(b => {
                coords.push([b.longitude, b.latitude]);
                if (b.trams) {
                    trams.push([b.trams.door_no, b.longitude, b.latitude]);
                }
            });
            getRoutes(coords).then((routes) => {
                res.json({tramstops: data, routes: routes, trams: trams});
            });
        });
    } catch (error) {
        res.json({ error: "Bus not found" });
    }
});

module.exports = apiRouter;