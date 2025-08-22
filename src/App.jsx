import { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    const apiKey = "YOUR_API_KEY"; // replace with your OpenWeather API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    setWeather(data);
  };

  return (
    <div className="app-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
      </div>

      {/* Weather Info */}
      {weather && weather.main && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <p>{Math.round(weather.main.temp)}°C | {weather.weather[0].main}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind: {weather.wind.speed} m/s</p>
        </div>
      )}

      {/* Forecast Placeholder */}
      <div className="forecast">
        <div className="forecast-card">
          <h4>Mon</h4>
          <p>28°C</p>
          <p>Sunny</p>
        </div>
        <div className="forecast-card">
          <h4>Tue</h4>
          <p>25°C</p>
          <p>Rain</p>
        </div>
        <div className="forecast-card">
          <h4>Wed</h4>
          <p>30°C</p>
          <p>Cloudy</p>
        </div>
      </div>
    </div>
  );
}

export default App;
