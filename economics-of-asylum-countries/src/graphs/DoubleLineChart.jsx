import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { countryState } from "../context/CountryProvider";
import { lur_data, ggxwdn_data, pcpipch_data } from "../utils/data_parser";
import LineChartSelector from "./LineChartSelector";

const DoubleLineChart = ({ countryTwoID }) => {
  const { currLineData, ID } = countryState();

  if (!currLineData || !currLineData[ID] || !currLineData[countryTwoID])
    return <h1> No Data present !</h1>;

  const ref = useRef();
  const curr_data = currLineData[ID];
  const data = [];
  const curr_data_two = currLineData[countryTwoID];
  const data_two = [];

  for (const year of curr_data.present) {
    const value = parseFloat(curr_data[year]);
    data.push({ Year: year, Value: value });
  }

  for (const year of curr_data_two.present) {
    const value = parseFloat(curr_data_two[year]);
    data_two.push({ Year: year, Value: value });
  }

  const year_union = [...curr_data.present, ...curr_data_two.present];

  useEffect(() => {
    const chartWidth = parseFloat(d3.select(ref.current).style("width"));
    const chartHeight = parseFloat(d3.select(ref.current).style("height"));

    // Chart dimensions and margins
    const margin = { top: 10, right: 10, bottom: 60, left: 60 };
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    // remove previous SVG if exists
    d3.select(ref.current).selectAll("*").remove(); // if not done then the re-renders overlap !

    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleBand().range([0, width]).domain(year_union).padding(0.2);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    const y = d3
      .scaleLinear()
      .domain([
        0,
        Math.max(
          d3.max(data, (d) => d.Value),
          d3.max(data_two, (d) => d.Value)
        ),
      ])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    const g = svg.append("g");

    // Line generators for each dataset
    const line = d3
      .line()
      .x((d) => x(d.Year))
      .y((d) => y(d.Value));

    console.log(data, data_two);

    // Render lines
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "gold")
      .attr("stroke-width", 3)
      .attr("d", line);

    g.append("path")
      .datum(data_two)
      .attr("fill", "none")
      .attr("stroke", "darkgoldenrod")
      .attr("stroke-width", 3)
      .attr("d", line);
  }, [currLineData, ID, data, data_two]);

  return (
    <div>
      <LineChartSelector></LineChartSelector>
      <svg height={"80vh"} width={"50vw"} id="linechart" ref={ref} />
    </div>
  );
};

export default DoubleLineChart;