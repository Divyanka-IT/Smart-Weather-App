import express from "express";
import cors from "cors";
import axios from "axios";
import fs from "fs";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const nearbyCities = JSON.parse(fs.readFileSync("./data/nearbyCities.json", "utf-8"));

app.get("/api/weather", async (req, res) => {
  const { city, lat, lon } = req.query;

  try {
    let latitude = lat;
    let longitude = lon;
    let locationName = city;

    // If only city name is provided, use Open-Meteo geocoding
    if (city && (!lat || !lon)) {
      const geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      );
      if (geoRes.data.results && geoRes.data.results.length > 0) {
        latitude = geoRes.data.results[0].latitude;
        longitude = geoRes.data.results[0].longitude;
        locationName = geoRes.data.results[0].name;
      } else {
        return res.status(404).json({ error: "City not found" });
      }
    }

    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    const { temperature, windspeed, weathercode, time } = weatherRes.data.current_weather;

    res.json({
      city: locationName,
      temperature,
      windspeed,
      weathercode,
      time,
      lat: latitude,
      lon: longitude
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/api/nearby", (req, res) => {
  res.json(nearbyCities);
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
