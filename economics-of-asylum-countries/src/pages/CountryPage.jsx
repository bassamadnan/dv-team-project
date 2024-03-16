import React from "react";
import { countryState } from "../context/CountryProvider";
import LineChart from "../graphs/LineChart";

const CountryPage = () => {
  const { country } = countryState();

  return (
    <div className="grid grid-cols-2 grid-rows-2">
        <div>1 </div>
        <div>2 </div>
        <div>3 </div>
        <div>4 </div>
    </div>
  );
};

export default CountryPage;
