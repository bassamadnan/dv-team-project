import React from "react";
import { countryState } from "../context/CountryProvider";
import LineChart from "../graphs/LineChart";
import CountryMap from "../graphs/CountryMap";
import Map from "../graphs/Map";
import { numeric_to_alpha3 } from "../utils/numericToAlpha";

const CountryPage = () => {
  const { ID } = countryState();
  // console.log(ID, numeric_to_alpha3[ID]);
  return (
    <div className="grid grid-cols-2 grid-rows-2">
      <div>
        <Map  countryCode={numeric_to_alpha3[ID]}/>
      </div>
      <div>2 </div>
      <div>3 </div>
      <div>4 </div>
    </div>
  );
};

export default CountryPage;
