import React from "react";
import { countryState } from "../context/CountryProvider";
import LineChart from "../graphs/LineChart";

const CountryPage = () => {
  const { country } = countryState();

  return (
    <div>
      <h1>Rendering Country {`${country}`}</h1>
      <LineChart />
    </div>
  );
};

export default CountryPage;
