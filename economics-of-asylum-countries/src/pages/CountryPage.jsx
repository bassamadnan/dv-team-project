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
    <div className="flex flex-col">
      <div>
        <Map  countryCode={numeric_to_alpha3[ID]}/>
      </div>
      <div>
        <LineChart />
      </div>
      <div>3 </div>
      <div>4 </div>
    </div>
  );
};

export default CountryPage;
