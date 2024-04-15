import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { countryState } from "../context/CountryProvider";
import {
  outgoing_refugee_data,
  incoming_refugee_data,
} from "../utils/data_parser";

const BarChartComparison = () => {
  const { currData, ID } = countryState();

  if (!currData || !currData[ID]) return <h1> No Data present !</h1>;

  const ref = useRef();
  console.log("incoming");
  const data = []; // Array to hold combined data for both incoming and outgoing

  // Function to aggregate counts for each year
  const aggregateCounts = (dataset) => {
    const aggregatedData = {};
    dataset.forEach((entry) => {
      Object.keys(entry.IDs).forEach((id) => {
        const year = entry.Year;
        if (!aggregatedData[year]) {
          aggregatedData[year] = 0;
        }
        aggregatedData[year] += entry.IDs[id].count;
      });
    });
    return aggregatedData;
  };
  console.log("ok 1");

  // Populate data array with incoming counts
  Object.keys(incoming_refugee_data).forEach((year) => {
    const yearData = incoming_refugee_data[year];
    let totalIncomingCount = 0;
    Object.keys(yearData).forEach((id) => {
      totalIncomingCount = yearData[id];
    });
    data.push({
      Year: year,
      Incoming: totalIncomingCount,
    });
  });

  console.log("ok 2");

  // Populate data array with aggregated outgoing counts if it exists
  if (outgoing_refugee_data) {
    Object.keys(outgoing_refugee_data).forEach((year) => {
      const index = data.findIndex((item) => item.Year === year);
      if (index !== -1) {
        // If the year exists in incoming data, update outgoing count
        data[index].outgoing_refugee_data = outgoing_refugee_data[year].IDs.Count
          ? aggregateCounts([outgoing_refugee_data[year]])[year]
          : 0;
      } else {
        // If the year doesn't exist in incoming data, add it to data array
        data.push({
          Year: year,
          Outgoing: outgoing_refugee_data[year].IDs
            ? aggregateCounts([outgoing_refugee_data[year]])[year]
            : 0,
        });
      }
    });
  }

  useEffect(() => {
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

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

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.Incoming, d.Outgoing))])
      .nice()
      .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    // Append incoming bars
    svg
      .selectAll(".incoming-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "incoming-bar")
      .attr("x", (d) => x(d.Year))
      .attr("y", (d) => y(d.Incoming))
      .attr("width", x.bandwidth() / 2)
      .attr("height", (d) => height - y(d.Incoming))
      .attr("fill", "steelblue");

    // Append outgoing bars
    svg
      .selectAll(".outgoing-bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "outgoing-bar")
      .attr("x", (d) => x(d.Year) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.Outgoing))
      .attr("width", x.bandwidth() / 2)
      .attr("height", (d) => height - y(d.Outgoing))
      .attr("fill", "orange");
  }, [currData, ID]);

  return (
    <div className=" bg-lime-600 border-blue-800 border-solid border-4">
      <svg width={800} height={600} id="barchart" ref={ref} />
    </div>
  );
};

export default BarChartComparison;
