import React, { createContext, useState, useCallback, useMemo } from 'react';

const MeasurementsContext = createContext();

export function MeasurementsProvider({ children }) {
  const [measurements, setMeasurements] = useState({
    'non-lazy': [],
    'lazy': []
  });

  const handleMeasure = useCallback((type, time, renderNum) => {
    setMeasurements(prev => ({
      ...prev,
      [type]: [...prev[type], { time, renderNum }]
    }));
  }, []);

  const resetMeasurements = useCallback(() => {
    setMeasurements({ 'non-lazy': [], 'lazy': [] });
  }, []);

  const avgNonLazy = useMemo(() => {
    return measurements['non-lazy'].length > 0
      ? (measurements['non-lazy'].reduce((sum, m) => sum + m.time, 0) / measurements['non-lazy'].length).toFixed(4)
      : 0;
  }, [measurements['non-lazy']]);

  const avgLazy = useMemo(() => {
    return measurements['lazy'].length > 0
      ? (measurements['lazy'].reduce((sum, m) => sum + m.time, 0) / measurements['lazy'].length).toFixed(4)
      : 0;
  }, [measurements['lazy']]);

  const totalNonLazy = useMemo(() => {
    return measurements['non-lazy'].reduce((sum, m) => sum + m.time, 0).toFixed(4);
  }, [measurements['non-lazy']]);

  const totalLazy = useMemo(() => {
    return measurements['lazy'].reduce((sum, m) => sum + m.time, 0).toFixed(4);
  }, [measurements['lazy']]);

  const value = useMemo(() => ({
    measurements,
    handleMeasure,
    resetMeasurements,
    avgNonLazy,
    avgLazy,
    totalNonLazy,
    totalLazy
  }), [measurements, handleMeasure, resetMeasurements, avgNonLazy, avgLazy, totalNonLazy, totalLazy]);

  return (
    <MeasurementsContext.Provider value={value}>
      {children}
    </MeasurementsContext.Provider>
  );
}

export function useMeasurements() {
  const context = React.useContext(MeasurementsContext);
  if (!context) {
    throw new Error('useMeasurements must be used within MeasurementsProvider');
  }
  return context;
}
