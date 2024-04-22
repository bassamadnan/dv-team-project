import React from "react";
import { countryState } from "../context/CountryProvider";
import LineChart from "../graphs/LineChart";
import CountryMap from "../graphs/CountryMap";
import Map from "../graphs/Map";
import { numeric_to_alpha3 } from "../utils/numericToAlpha";
import BarChart from "../graphs/BarChart";
import Particle from "../graphs/Particle";
import Slider from "../graphs/Slider";
// import ComparableBubbleChart from "../graphs/Bubble";
import GroupVisualization from "../graphs/Bubble";
// import renderBubbleChart from "../graphs/Bubble";
/*
  A 2x2 grid component , basically having 4 divs equally spaced
  The divs are as follows
  first div -> Displays the country (single) clicked on from home page by passing a prop of the alpha3 code
  second div -> Displays the bar chart of economy related statistics
  third div -> Shows a corelation between the economy and the refugee
  fourth div -> Shows a line graph having corelated statistics of gdp such as employment rate, debt rate etc.
*/

const SingleCountry = () => {
  const { ID } = countryState();
  // console.log(ID, numeric_to_alpha3[ID]);
  return (
    <div>
      <div className="grid grid-cols-2 grid-rows-2">
        <div>
          <Particle />
          <Slider />
        </div>
        <div>
          <BarChart />
        </div>
        <div>
          {/* <ComparableBubbleChart /> */}
          {/* <GroupVisualization /> */}
        </div>
        <div>
          <LineChart />
        </div>
      </div>
      <div>
        {/* <ComparableBubbleChart /> */}
        <GroupVisualization />
        {/* <renderBubbleChart /> */}
      </div>
    </div>
  );
};

export default SingleCountry;
