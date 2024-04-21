import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { lur_data } from "../utils/data_parser";

const GroupVisualization = () => {
  const [selectedYear, setSelectedYear] = useState("2023");

  const years = [
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
  ];
  const svgRef = useRef();

  useEffect(() => {
    // Initial draw when component mounts
    drawBubbleChart(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart
    drawBubbleChart(selectedYear);
  }, [selectedYear]);

  const drawBubbleChart = (year) => {
    // Extracting data for the selected year
    const data = Object.entries(lur_data).map(([country, values]) => ({
      country,
      value: values[year] || 0, // If no value exists for the year, default to 0
    }));

    const svg = d3.select(svgRef.current);

    // Define the scales for mapping data to visual properties
    const radiusScale = d3
      .scaleSqrt()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([2, 20]);

    const simulation = d3
      .forceSimulation(data)
      .force("charge", d3.forceManyBody().strength(-15))
      .force("center", d3.forceCenter(500, 500))
      .force(
        "collide",
        d3.forceCollide().radius((d) => radiusScale(d.value) + 3) // Adjust the collision detection radius
      )
      .on("tick", ticked);

    const g = svg.append("g");

    function ticked() {
      const circles = g
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", (d) => radiusScale(d.value))
        .attr("fill", "steelblue")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      const labels = g
        .selectAll("text")
        .data(data)
        .join("text")
        .text((d) => d.country)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      // Calculate the new position within the SVG boundaries
      const newX = Math.max(
        radiusScale(d.value),
        Math.min(2000 - radiusScale(d.value), event.x)
      );
      const newY = Math.max(
        radiusScale(d.value),
        Math.min(1000 - radiusScale(d.value), event.y)
      );

      // Update the position of the circle and its label
      d.fx = newX;
      d.fy = newY;
    //   d.fx = d.fx;
    //   d.fy = d.fy;
      d3.select(this).attr("cx", newX).attr("cy", newY);
      d3.select(this.nextSibling).attr("x", newX).attr("y", newY);
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  const changeStackCountry = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
  };

  return (
    <div className="dropdown">
      <h2 style={{ textAlign: "center" }}>Group Visualization</h2>
      <div style={{ display: "flex" }}>
        <div style={{ width: "300px" }} />
        <label htmlFor="bubbleChartSelectYear">Select A Year: </label>
        <div style={{ textAlign: "center" }} className="select">
          <select
            id="bubbleChartSelectYear"
            onChange={changeStackCountry}
            value={selectedYear}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <svg width="2000" height="1000" id="ClusterBubble" ref={svgRef} />
    </div>
  );
};

export default GroupVisualization;
