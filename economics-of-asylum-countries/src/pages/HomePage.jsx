import React from "react";
import Geomap from "../graphs/Geomap";
import Slider from "../graphs/Slider";

const HomePage = () => {
  return (
    <div className="p-2">
      <h1 className="text-center text-3xl font-serif">Economics of Asylum Countries</h1>
      <h3 className="text-center text-2xl font-serif">Refugee migration around the world</h3>
      <Geomap />
    </div>
  );
};

export default HomePage;
