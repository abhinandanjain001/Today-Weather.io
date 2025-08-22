import React from 'react';
import ForecastCard from './ForecastCard';

export default function ForecastList({ forecast }) {
  return (
    <div className="forecast-list">
      {forecast.map(day => (
        <ForecastCard key={day.dt} day={day} />
      ))}
    </div>
  );
}
