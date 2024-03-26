import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { countryState } from "../context/CountryProvider";
import { lur_data, ggxwdn_data, pcpipch_data } from "../utils/data_parser";

const LineChart = () => {
  const { ID } = countryState();
  const ref = useRef();
  const LUR = lur_data[ID];
  const GDP = ggxwdn_data[ID];
  const INFLATION = pcpipch_data[ID];

  useEffect(() => {
    if (!LUR || !GDP || !INFLATION) return;

    // Filtered data for each dataset
    const filteredLUR = LUR.present.map((year) => ({
      year: +year,
      value: parseFloat(LUR[year]),
    }));

    const filteredGDP = GDP.present.map((year) => ({
      year: +year,
      value: parseFloat(GDP[year]),
    }));

    const filteredINFLATION = INFLATION.present.map((year) => ({
      year: +year,
      value: parseFloat(INFLATION[year]),
    }));

    // Chart dimensions and margins
    const margin = { top: 30, right: 30, bottom: 70, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    // Combine all data points into one array
    const allData = [...filteredLUR, ...filteredGDP, ...filteredINFLATION];

    // Define scales for x and y axes
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(allData, (d) => d.year))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(allData, (d) => d.value),
        d3.max(allData, (d) => d.value),
      ])
      .range([height, 0]);

    const svg = d3.select(ref.current);

    // Remove existing elements before rendering
    svg.selectAll("*").remove();

    // Append new SVG elements
    svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Line generators for each dataset
    const lineLUR = d3
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value));

    const lineGDP = d3
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value));

    const lineINFLATION = d3
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.value));

    // Render lines
    g.append("path")
      .datum(filteredLUR)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3)
      .attr("d", lineLUR);

    g.append("path")
      .datum(filteredGDP)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 3)
      .attr("d", lineGDP);

    g.append("path")
      .datum(filteredINFLATION)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 3)
      .attr("d", lineINFLATION);

    // Append x and y axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    g.append("g").call(d3.axisLeft(yScale));

    // Create legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - 400},${margin.top})`);

    // Add legend items
    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "steelblue");

    legend
      .append("text")
      .attr("x", 30)
      .attr("y", 10)
      .attr("dy", "0.35em")
      .text("Unemployment Rates");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 30)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "green");

    legend
      .append("text")
      .attr("x", 30)
      .attr("y", 40)
      .attr("dy", "0.35em")
      .text("Debt as percentage of gdp");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 60)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "red");

    legend
      .append("text")
      .attr("x", 30)
      .attr("y", 70)
      .attr("dy", "0.35em")
      .text("Inflation rate");
  }, [ID, LUR, GDP, INFLATION]);

  return (
    <div className=" bg-yellow-300 border-red-700 border-solid border-4">
      <svg ref={ref} />
    </div>
  );
};

export default LineChart;
