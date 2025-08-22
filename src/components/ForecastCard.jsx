import React from 'react';

export default function ForecastCard({ day }) {
  const date = new Date(day.dt_txt);
  const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

  return (
    <div className="card">
      <div className="date">{date.toDateString()}</div>
      <img src={iconUrl} alt={day.weather.description} />
      <div className="temp">{Math.round(day.main.temp)}°C</div>
      <div className="desc">{day.weather.main}</div>
    </div>
  );
}
