import React from 'react';
import { useMeasurements } from '../context/MeasurementsContext';

function Results() {
  const { measurements, avgNonLazy, avgLazy, totalNonLazy, totalLazy } = useMeasurements();

  if (measurements['non-lazy'].length === 0) {
    return null;
  }

  return (
    <div className="results">
      <h2>📊 Kết quả đo (ms)</h2>
      <div className="stats">
        <div className="stat-box non-lazy-stat">
          <h3>❌ Non-Lazy</h3>
          <p className="label">Trung bình</p>
          <p className="time">{avgNonLazy}ms</p>
          <p className="label">Tổng cộng</p>
          <p className="total-time">{totalNonLazy}ms</p>
          <p className="samples">Renders: {measurements['non-lazy'].length}</p>
        </div>
        <div className="stat-box lazy-stat">
          <h3>✅ Lazy</h3>
          <p className="label">Trung bình</p>
          <p className="time">{avgLazy}ms</p>
          <p className="label">Tổng cộng</p>
          <p className="total-time">{totalLazy}ms</p>
          <p className="samples">Renders: {measurements['lazy'].length}</p>
        </div>
        <div className="stat-box diff-stat">
          <h3>📈 So sánh</h3>
          <p className="label">Chênh lệch TB</p>
          <p className="time">{Math.abs(avgNonLazy - avgLazy).toFixed(4)}ms</p>
          <p className="label">Chênh lệch tổng</p>
          <p className="total-time">{Math.abs(totalNonLazy - totalLazy).toFixed(4)}ms</p>
          <p className="note">
            {parseFloat(totalNonLazy) > parseFloat(totalLazy)
              ? `✅ Lazy nhanh hơn ${((totalNonLazy / totalLazy - 1) * 100).toFixed(1)}%`
              : parseFloat(totalLazy) > parseFloat(totalNonLazy)
                ? '⚠️ Non-lazy nhanh hơn (bất thường)'
                : '➖ Gần như bằng nhau'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Results;
