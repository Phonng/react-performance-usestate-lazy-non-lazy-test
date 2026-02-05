import React, { useState, useEffect } from 'react';
import './App.css';

// Hàm tính toán nặng để test
function expensiveCalculation() {
  let result = 0;
  for (let i = 0; i < 5000000; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

// Component test không dùng lazy initialization
function NonLazyComponent({ onMeasure }) {
  const renderCount = React.useRef(0);
  renderCount.current++;

  const start = performance.now();
  const [heavyData] = useState({
    value: expensiveCalculation(),
    timestamp: Date.now()
  });
  const end = performance.now();

  useEffect(() => {
    if (renderCount.current === 1) {
      onMeasure('non-lazy', end - start);
    }
  }, [end, start, onMeasure]);

  const [count, setCount] = useState(0);

  return (
    <div className="component-box non-lazy">
      <h3>❌ Non-Lazy Initialization</h3>
      <p>useState(expensiveCalculation())</p>
      <p className="render-count">Renders: {renderCount.current}</p>
      <p className="data-value">Value: {heavyData.value.toFixed(2)}</p>
      <button onClick={() => setCount(count + 1)}>
        Re-render (Count: {count})
      </button>
    </div>
  );
}

// Component test dùng lazy initialization
function LazyComponent({ onMeasure }) {
  const renderCount = React.useRef(0);
  renderCount.current++;

  const start = performance.now();
  const [heavyData] = useState(() => {
    return {
      value: expensiveCalculation(),
      timestamp: Date.now()
    };
  });
  const end = performance.now();

  useEffect(() => {
    if (renderCount.current === 1) {
      onMeasure('lazy', end - start);
    }
  }, [end, start, onMeasure]);

  const [count, setCount] = useState(0);

  return (
    <div className="component-box lazy">
      <h3>✅ Lazy Initialization</h3>
      <p>useState(() =&gt; expensiveCalculation())</p>
      <p className="render-count">Renders: {renderCount.current}</p>
      <p className="data-value">Value: {heavyData.value.toFixed(2)}</p>
      <button onClick={() => setCount(count + 1)}>
        Re-render (Count: {count})
      </button>
    </div>
  );
}

function App() {
  const [measurements, setMeasurements] = useState({
    'non-lazy': [],
    'lazy': []
  });
  const [showComponents, setShowComponents] = useState(false);

  const handleMeasure = (type, time) => {
    setMeasurements(prev => ({
      ...prev,
      [type]: [...prev[type], time]
    }));
  };

  const resetTest = () => {
    setShowComponents(false);
    setMeasurements({ 'non-lazy': [], 'lazy': [] });
    setTimeout(() => setShowComponents(true), 100);
  };

  const avgNonLazy = measurements['non-lazy'].length > 0
    ? (measurements['non-lazy'].reduce((a, b) => a + b, 0) / measurements['non-lazy'].length).toFixed(4)
    : 0;

  const avgLazy = measurements['lazy'].length > 0
    ? (measurements['lazy'].reduce((a, b) => a + b, 0) / measurements['lazy'].length).toFixed(4)
    : 0;

  return (
    <div className="App">
      <header className="App-header">
        <h1>⚡ React useState Performance Test</h1>
        <p>So sánh Lazy vs Non-Lazy Initialization</p>
      </header>

      <div className="controls">
        <button className="start-btn" onClick={() => setShowComponents(true)}>
          🚀 Bắt đầu Test
        </button>
        <button className="reset-btn" onClick={resetTest}>
          🔄 Reset & Test lại
        </button>
      </div>

      {measurements['non-lazy'].length > 0 && (
        <div className="results">
          <h2>📊 Kết quả đo (ms)</h2>
          <div className="stats">
            <div className="stat-box non-lazy-stat">
              <h3>Non-Lazy</h3>
              <p className="time">{avgNonLazy}ms</p>
              <p className="samples">Samples: {measurements['non-lazy'].length}</p>
            </div>
            <div className="stat-box lazy-stat">
              <h3>Lazy</h3>
              <p className="time">{avgLazy}ms</p>
              <p className="samples">Samples: {measurements['lazy'].length}</p>
            </div>
            <div className="stat-box diff-stat">
              <h3>Chênh lệch</h3>
              <p className="time">{Math.abs(avgNonLazy - avgLazy).toFixed(4)}ms</p>
              <p className="note">
                {avgNonLazy > avgLazy 
                  ? '✅ Lazy nhanh hơn' 
                  : avgLazy > avgNonLazy 
                    ? '⚠️ Non-lazy nhanh hơn (bất thường)' 
                    : '➖ Gần như bằng nhau'}
              </p>
            </div>
          </div>
        </div>
      )}

      {showComponents && (
        <div className="components-container">
          <NonLazyComponent onMeasure={handleMeasure} />
          <LazyComponent onMeasure={handleMeasure} />
        </div>
      )}

      <div className="explanation">
        <h2>🔍 Giải thích</h2>
        <ul>
          <li><strong>Non-Lazy:</strong> Hàm expensiveCalculation() chạy MỖI lần component render</li>
          <li><strong>Lazy:</strong> Hàm expensiveCalculation() chỉ chạy 1 lần duy nhất khi mount</li>
          <li>Nhấn nút "Re-render" nhiều lần để thấy sự khác biệt rõ ràng</li>
          <li>Lazy initialization hữu ích khi giá trị khởi tạo tốn nhiều tài nguyên</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
