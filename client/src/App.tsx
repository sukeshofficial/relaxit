import { useState, useEffect } from 'react';

import Wrapper from './pages/Wrapper'
import AppInitializer from './components/AppInitializer';

import logoAsset from "./assets/wordmark.svg";
import './App.css'

function App() {
  return (
    <AppInitializer>
      <Wrapper logo={{ type: "wordmark", url: logoAsset }} />
    </AppInitializer>
  )
}

export default App
