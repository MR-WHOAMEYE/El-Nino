import React from 'react';
import { ClimateProvider } from './context/ClimateContext';
import Landing from './pages/Landing';

export function App() {
  return (
    <ClimateProvider>
      <Landing />
    </ClimateProvider>
  );
}

export default App;
