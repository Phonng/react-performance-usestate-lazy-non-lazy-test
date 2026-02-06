import React, { useState, useEffect } from 'react';
import './App.css';
import { MeasurementsProvider, useMeasurements } from './context/MeasurementsContext';
import Results from './components/Results';

// Hàm tính toán nặng để test
function expensiveCalculation() {
  let result = 0;
  for (let i = 0; i < 500000; i++) {
    result += Math.sqrt(i) + Math.sin(i) * Math.cos(i) + Math.pow(i % 1000, 0.5) + Math.log(i + 1) + Math.sin(i) * Math.cos(i);
  }
  return result;
}

// Component test không dùng lazy initialization
function NonLazyComponent({ autoRender }) {
  const { handleMeasure } = useMeasurements();
  const renderCount = React.useRef(0);
  renderCount.current++;

  const start = performance.now();
  const [heavyData] = useState({
    value: expensiveCalculation(),
    timestamp: Date.now()
  });
  const end = performance.now();

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < 10) {
      handleMeasure('non-lazy', end - start, renderCount.current);
    }
  }, [count, end, handleMeasure, start]);
  // Auto re-render
  useEffect(() => {
    if (autoRender && count < 10) {
      const timer = setTimeout(() => {
        setCount(count + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [count, autoRender]);

  return (
    <div className="component-box non-lazy">
      <h3>❌ Non-Lazy Initialization</h3>
      <p>useState(expensiveCalculation())</p>
      <p className="render-count">Renders: {renderCount.current}</p>
      <p className="data-value">Value: {heavyData.value.toFixed(2)}</p>

    </div>
  );
}

// Component test dùng lazy initialization
function LazyComponent({ autoRender }) {
  const { handleMeasure } = useMeasurements();
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

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < 10) {
      handleMeasure('lazy', end - start, renderCount.current);
    }
  }, [count, end, handleMeasure, start]);
  // Auto re-render
  useEffect(() => {
    if (autoRender && count < 10) {
      const timer = setTimeout(() => {
        setCount(count + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [count, autoRender]);


  return (
    <div className="component-box lazy">
      <h3>✅ Lazy Initialization</h3>
      <p>useState(() =&gt; expensiveCalculation())</p>
      <p className="render-count">Renders: {renderCount.current}</p>
      <p className="data-value">Value: {heavyData.value.toFixed(2)}</p>

    </div>
  );
}

function AppContent() {
  const { resetMeasurements } = useMeasurements();
  const [showComponents, setShowComponents] = useState(false);
  const [autoRender, setAutoRender] = useState(false);

  const resetTest = () => {
    setShowComponents(false);
    setAutoRender(false);
    resetMeasurements();
    setTimeout(() => setShowComponents(true), 100);
  };

  const startAutoTest = () => {
    setShowComponents(false);
    resetMeasurements();
    setTimeout(() => {
      if (!showComponents) {
        setShowComponents(true);
      }
      if (!autoRender) {
        setAutoRender(true);
      }
    }, 100);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>⚡ React useState Performance Test</h1>
        <p>So sánh Lazy vs Non-Lazy Initialization</p>
      </header>

      <div className="controls">
        <button className="start-btn" onClick={startAutoTest}>
          🚀 Auto Test (10 renders)
        </button>
        <button className="manual-btn" onClick={() => setShowComponents(true)}>
          ✋ Manual Test
        </button>
        <button className="reset-btn" onClick={resetTest}>
          🔄 Reset
        </button>
      </div>

      <Results />

      {showComponents && (
        <div className="components-container">
          <NonLazyComponent autoRender={autoRender} />
          <LazyComponent autoRender={autoRender} />
        </div>
      )}

      <div className="explanation">
        <h2>🔍 Giải thích</h2>
        <ul>
          <li><strong>Auto Test:</strong> Tự động render 10 lần để thấy sự khác biệt rõ ràng nhất</li>
          <li><strong>Manual Test:</strong> Bạn tự nhấn nút "Re-render" để kiểm soát</li>
          <li><strong>Non-Lazy:</strong> Hàm expensiveCalculation() chạy MỖI lần component render</li>
          <li><strong>Lazy:</strong> Hàm expensiveCalculation() chỉ chạy 1 lần duy nhất khi mount</li>
          <li><strong>Kết quả:</strong> Sau 10 lần render, Non-Lazy sẽ chậm hơn Lazy rất nhiều</li>
          <li>Lazy initialization hữu ích khi giá trị khởi tạo tốn nhiều tài nguyên</li>
        </ul>
      </div>
    </div>
  );
}

function App() {
  return (
    <MeasurementsProvider>
      <AppContent />
    </MeasurementsProvider>
  );
}

export default App;
