import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { countryState } from "../context/CountryProvider";
import { gdp_data } from "../utils/data_parser";
// https://kamibrumi.medium.com/getting-started-with-react-d3-js-d86ccea05f08 <- started code


const BarChart = () => {
  const { ID } = countryState();
  const ref = useRef();
  const curr_data = gdp_data[ID];
  const data = [];

  for (const year of curr_data.present) {
    const value = parseFloat(curr_data[year].replace(/,/g, ""));
    data.push({ Year: year, Value: value });
  }

  // console.log(data);

  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.Year))
      .padding(0.2);
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.Value)])
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Bars
    const bars = svg
      .selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.Year))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0);

    // Animation
    bars
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.Value))
      .attr("height", (d) => height - y(d.Value));

    // Tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid black")
      .style("padding", "5px");

    bars
      .on("mouseover", function (event, d) {
        tooltip
          .style("visibility", "visible")
          .html(`Year: ${d.Year}<br>Value: ${d.Value}`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });
  }, []);

  return (
    <div style={{"background": "steelblue", color:"black"}}>
      <svg width={800} height={600} id="barchart" ref={ref} />
    </div>
  );
};

export default BarChart;