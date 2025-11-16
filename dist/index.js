import express from "express";
import axios from "axios";
import "dotenv/config";
import { calcualteAQIIndex } from "./calc_AQI.js";
const app = express();
// Enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
app.use(express.json());
const API_KEY = process.env.OPEN_WEATHER_API_KEY;
app.get("/", (req, res) => {
    res.json({ message: "hi there from GET ep" });
});
app.post("/city-details", async (req, res) => {
    const { city } = req.body;
    if (!API_KEY) {
        return res.status(403).json({ message: "No api key found" });
    }
    const city_details = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`);
    const city_data = city_details.data;
    const city_lat = city_data[0].lat;
    const city_lon = city_data[0].lon;
    console.log(`lon: ${city_lon}, lat: ${city_lat}`);
    if (!city_details.data) {
        return res.status(404).json({ message: "city data not found" });
    }
    const pollution_data = await axios.get(`http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${city_lat}&lon=${city_lon}&appid=${API_KEY}`);
    const components = pollution_data.data.list[0].components;
    const aqiResult = await calcualteAQIIndex({
        co: components.co,
        no2: components.no2,
        so2: components.so2,
        o3: components.o3,
        pm10: components.pm10,
        pm2_5: components.pm2_5,
    });
    return res.status(200).json({
        message: "Fetched details successfully",
        city: {
            name: city,
            lat: city_lat,
            lon: city_lon,
        },
        aqiIndex: aqiResult.aqi.finalAQI,
        aqiDetails: aqiResult,
    });
});
app.listen(8000, () => console.log("Running at PORT 8000"));
//# sourceMappingURL=index.js.map