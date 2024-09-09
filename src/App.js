// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Mainpage from "./pages/mainpage";
import CityWeather from "./pages/weatherpage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Mainpage />} />
        <Route path="/city-weather/:cityName" element={<CityWeather />} />
      </Routes>
    </Router>
  );
};

export default App;
