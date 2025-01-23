import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { ChartComponents } from "./ChartComponents";
import { Home } from "./Home";
import { Trade } from "./Trade";
import { Routes, Route, Link } from "react-router-dom";
function App() {
  return (
    <>
      <h1>Demo Trading App</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/trade">Trade</Link>
      </nav>
      <Routes>
        <Route index element={<Home />} />
        <Route path="trade" element={<Trade />} />
      </Routes>
    </>
  );
}

export default App;
