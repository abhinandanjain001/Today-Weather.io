import React, { useState } from "react";

// Replace with your OpenWeatherMap API key
const API_KEY = "74426455880a7d1226cfd4b255daf1ae";

// Helper to group forecast list by date
const groupForecastByDay = (list) => {
  const daysMap = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toISOString().split("T")[0]; // YYYY-MM-DD
    if (!daysMap[date]) daysMap[date] = [];
    daysMap[date].push(item);
  });
  return Object.entries(daysMap).sort();
};

// Format date as "Monday, Aug 25"
const formatDay = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

// Main component
function App() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState([]);     // grouped day -> hourly data
  const [selectedDay, setSelectedDay] = useState(0);
  const [locationName, setLocationName] = useState("");
  const [error, setError] = useState("");

  const fetchForecast = async () => {
    setError("");
    setDays([]);
    setSelectedDay(0);
    setLocationName("");
    if (!city.trim()) {
      setError("Please enter a city name");
      return;
    }
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          city.trim()
        )}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== "200") {
        setError(data.message || "City not found");
        return;
      }

      setLocationName(`${data.city.name}, ${data.city.country}`);
      setDays(groupForecastByDay(data.list));
      setSelectedDay(0);
    } catch {
      setError("Failed to fetch forecast data.");
    }
  };

  // Get main weather info for selected day (closest to noon or middle hour)
  const getMainDayInfo = (hours) => {
    const noonHour = hours.find((h) => new Date(h.dt * 1000).getHours() === 12);
    const mainHour = noonHour || hours[Math.floor(hours.length / 2)];
    return {
      dt_txt: mainHour.dt_txt,
      temp: Math.round(mainHour.main.temp),
      icon: mainHour.weather[0].icon,
      desc: mainHour.weather[0].description,
      wind: mainHour.wind.speed,
      humidity: mainHour.main.humidity,
      pressure: mainHour.main.pressure,
    };
  };

  return (
    <div className="weather-bg">
      <div className="weather-main">
        <h1 className="title">Weather Forecast</h1>
        <div className="search-bar">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchForecast()}
            placeholder="Enter city"
          />
          <button onClick={fetchForecast}>Search</button>
        </div>
        {error && <div className="error-msg">{error}</div>}

        {days.length > 0 && (
          <>
            <div className="card-selector">
              {days.map(([date], idx) => (
                <button
                  key={date}
                  className={`day-tab ${selectedDay === idx ? "active" : ""}`}
                  onClick={() => setSelectedDay(idx)}
                >
                  {formatDay(date)}
                </button>
              ))}
            </div>

            <div className="main-card">
              <div className="top-info">
                <div className="main-city">
                  {formatDay(days[selectedDay][0])}
                  <br />
                  <span className="location">{locationName}</span>
                </div>

                <div className="main-icon-temp">
                  <img
                    src={`https://openweathermap.org/img/wn/${getMainDayInfo(days[selectedDay][1]).icon}@4x.png`}
                    alt={getMainDayInfo(days[selectedDay][1]).desc}
                  />
                  <div className="main-temp">{getMainDayInfo(days[selectedDay][1]).temp}°C</div>
                  <div className="main-desc">{getMainDayInfo(days[selectedDay][1]).desc}</div>
                </div>

                <div className="main-extras">
                  <div>💧 Humidity: {getMainDayInfo(days[selectedDay][1]).humidity}%</div>
                  <div>💨 Wind: {getMainDayInfo(days[selectedDay][1]).wind} m/s</div>
                  <div>🔽 Pressure: {getMainDayInfo(days[selectedDay][1]).pressure} hPa</div>
                </div>
              </div>

              <div className="hour-scroll">
                {days[selectedDay][1].map((hour) => {
                  const hourDate = new Date(hour.dt * 1000);
                  return (
                    <div key={hour.dt} className="hourly-card" title={hour.weather[0].description}>
                      <div className="hour">{hourDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      <img
                        src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                        alt={hour.weather[0].description}
                        className="weather-icon"
                      />
                      <div className="small-temp">{Math.round(hour.main.temp)}°</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
