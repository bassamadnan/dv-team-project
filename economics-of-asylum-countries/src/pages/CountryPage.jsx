import React from "react";
import { countryState } from "../context/CountryProvider";
import LineChart from "../graphs/LineChart";
import CountryMap from "../graphs/CountryMap";
import Map from "../graphs/Map";
import { numeric_to_alpha3 } from "../utils/numericToAlpha";
import BarChart from "../graphs/BarChart";

const CountryPage = () => {
  const { ID } = countryState();
  // console.log(ID, numeric_to_alpha3[ID]);
  return (
    <div className="grid grid-cols-2 grid-rows-2">
      <div>
        <Map  countryCode={numeric_to_alpha3[ID]}/>
      </div>
      <div>
        <BarChart />
      </div>
      <div>
        <h1 className="text-3xl font-bold underline" style={{color:"blue"}}>
          Thank You !
        </h1>
      </div>
      <div><LineChart /> </div>
    </div>
  );
};

export default CountryPage;
