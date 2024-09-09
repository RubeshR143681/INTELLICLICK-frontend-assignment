import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import clear from "../images/clear.png";
import rain from "../images/rain.png";
import cloud from "../images/cloud.png";
import snow from "../images/snow.png";
import humidity from "../images/humidity.png";
import wind from "../images/wind.png";
import haze from "../images/haze.png";
import wheather from "../images/disaster.png";
import tempreature from "../images/thermometer.png";
import presure from "../images/gauge.png";
import mist from "../images/mist.png";
// Function to get background class based on weather condition
const getBackgroundClass = (weatherCondition) => {
  switch (weatherCondition) {
    case "clear":
      return "bg-gradient-to-br from-yellow-400 to-blue-500"; // Sunny gradient
    case "rain":
      return "bg-gradient-to-br from-gray-600 to-gray-900"; // Rainy gradient
    case "clouds":
      return "bg-gradient-to-br from-gray-400 to-gray-600"; // Cloudy gradient
    case "snow":
      return "bg-gradient-to-br from-blue-100 to-white"; // Snowy gradient
    case "haze":
      return "bg-gradient-to-br from-gray-300 to-gray-500"; // Hazy gradient
    case "mist":
      return "bg-gradient-to-br from-gray-200 to-gray-400"; // Misty gradient
    default:
      return "bg-gradient-to-b from-blue-300 to-blue-500"; // Default gradient background
  }
};

// Main Component
const CityWeather = () => {
  const { cityName } = useParams();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("metric"); // Default unit (metric or imperial)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unit}&appid=9257949d8b1cde5c91be3846390a959f` // Replace with your OpenWeatherMap API key
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityName, unit]);

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  if (loading) return <p className="text-white text-2xl">Loading...</p>;
  if (error) return <p className="text-red-500 text-2xl">Error: {error}</p>;

  const weatherCondition = weather?.weather[0]?.main.toLowerCase();
  const backgroundClass = getBackgroundClass(weatherCondition);

  const weatherIcons = {
    clear: clear,
    rain: rain,
    clouds: cloud,
    snow: snow,
    haze: haze,
    wheather: wheather,
    mist: mist,
  };

  const weatherImage = weatherIcons[weatherCondition];

  return (
    <div
      className={`min-h-screen ${backgroundClass} p-6 flex flex-col items-center justify-center`}
    >
      <h1 className="lg:text-4xl text-2xl font-semibold  text-white mb-6">
        Weather for {cityName}
      </h1>
      <button
        onClick={toggleUnit}
        className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg mb-8 shadow-lg transform hover:scale-105 transition duration-300"
      >
        Switch to {unit === "metric" ? "Imperial" : "Metric"}
      </button>

      {weatherImage && (
        <img
          src={weatherImage}
          alt={weatherCondition}
          className="w-32 h-32 mb-6 animate-bounce"
        />
      )}

      {weather && (
        <div className="text-center  text-white space-y-2 flex flex-col lg:flex-row items-center gap-[30px] lg:justify-around lg:w-[70vw]">
          <div className="flex  flex-wrap gap-[20px] lg:gap-[30px] lg:w-[400px]">
            <div className="flex items-start gap-[12px] text-[22px] shadow-xl p-3 rounded-lg border-gray-400 border-[1px]">
              <img
                src={humidity}
                alt="humidity"
                className="lg:w-[46px] w-[26px] mt-[10px]"
              />
              <div>
                <p> {weather.main.humidity}%</p>
                <span className="block text-[16px]">Humidity</span>
              </div>
            </div>
            <div className="flex items-start gap-[12px] text-[22px] shadow-xl p-3 rounded-lg border-gray-400 border-[1px]">
              <img
                src={wind}
                alt="humidity"
                className="lg:w-[46px] w-[26px] mt-[10px]"
              />
              <div>
                <p> {weather.wind.speed}</p>
                <span className="block text-[16px]">Wind</span>
              </div>
            </div>
            <div className="flex items-start gap-[12px] text-[22px] shadow-xl p-3 rounded-lg border-gray-400 border-[1px]">
              <img
                src={tempreature}
                alt="humidity"
                className="lg:w-[46px] w-[26px] mt-[10px]"
              />
              <div>
                <p>
                  {weather.main.temp}°{unit === "metric" ? "C" : "F"}
                </p>
                <span className="block text-[16px]">Temperature</span>
              </div>
            </div>
            <div className="flex items-start gap-[12px] text-[22px] shadow-xl p-3 rounded-lg border-gray-400 border-[1px]">
              <img
                src={presure}
                alt="humidity"
                className="lg:w-[46px] w-[26px] mt-[10px]"
              />
              <div>
                <p> {weather.main.pressure} hPa</p>
                <span className="block text-[16px]">Pressure</span>
              </div>
            </div>
            <div className="flex items-start gap-[12px] text-[22px] shadow-xl p-3 rounded-lg border-gray-400 border-[1px]">
              <img
                src={wheather}
                alt="humidity"
                className="lg:w-[46px] w-[26px] mt-[10px]"
              />
              <div>
                <p> {weather.weather[0].description}</p>
                <span className="block text-[16px]">Weather</span>
              </div>
            </div>
          </div>
          <div className="lg:w-[50%] w-[99%]">
            <MapContainer
              center={[weather.coord.lat, weather.coord.lon]}
              zoom={13}
              className="h-72  rounded-lg shadow-md"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[weather.coord.lat, weather.coord.lon]}>
                <Popup>{cityName}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityWeather;
