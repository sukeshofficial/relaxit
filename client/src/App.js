import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import Wrapper from './pages/Wrapper';
import AppInitializer from './components/AppInitializer';
import logoAsset from "./assets/wordmark.svg";
import './App.css';
function App() {
    return (_jsx(AppInitializer, { children: _jsx(Wrapper, { logo: { type: "wordmark", url: logoAsset } }) }));
}
export default App;
