import React from "react";
import { countryState } from "../context/CountryProvider";
import LineChart from "../graphs/LineChart";
import CountryMap from "../graphs/CountryMap";
import Map from "../graphs/Map";
import { numeric_to_alpha3 } from "../utils/numericToAlpha";
import BarChart from "../graphs/BarChart";
import BarChartComparison from "../graphs/BarChartComapison";
import Particle from "../graphs/Particle";

/*
  A 2x2 grid component , basically having 4 divs equally spaced
  The divs are as follows
  first div -> Displays the country (single) clicked on from home page by passing a prop of the alpha3 code
  second div -> Displays the bar chart of economy related statistics
  third div -> Shows a corelation between the economy and the refugee
  fourth div -> Shows a line graph having corelated statistics of gdp such as employment rate, debt rate etc.
*/

const CompareCountry = () => {
  const { ID } = countryState();
  // console.log(ID, numeric_to_alpha3[ID]);
  return (
    < >
      <h1>Hello World !!</h1>
    </>
  );
};

export default CompareCountry;
