import React, { useEffect, useState } from "react";
import * as d3 from "d3";

function LineChart() {
  const [sliderValue, setSliderValue] = useState(0);
  const [minX, setMinX] = useState(0);
  const [maxX, setMaxX] = useState(0);

  useEffect(() => {
    const dataset1 = [
      [0, 1],
      [12, 20],
      [24, 36],
      [32, 50],
      [40, 70],
      [50, 100],
      [55, 106],
      [65, 123],
      [73, 130],
      [78, 134],
      [83, 136],
      [89, 138],
      [100, 140],
    ];

    var xValues = dataset1.map((d) => d[0]);
    const minXValue = d3.min(xValues);
    const maxXValue = d3.max(xValues);
    setMinX(minXValue);
    setMaxX(maxXValue);

    var filteredDataset = dataset1.filter((d) => d[0] <= sliderValue);

    const margin = { top: 50, right: 50, bottom: 100, left: 50 };
    const width = 500 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 200]).range([height, 0]);

    const svg = d3
      .select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Remove previous lines and circles
    svg.selectAll(".line").remove();
    svg.selectAll("circle").remove();

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-family", "Helvetica")
      .style("font-size", 20)
      .text("Line Chart");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .attr("text-anchor", "middle")
      .style("font-family", "Helvetica")
      .style("font-size", 12)
      .text("Year");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-family", "Helvetica")
      .style("font-size", 12)
      .text("GDP");

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g").call(d3.axisLeft(yScale));

    svg
      .selectAll("circle")
      .data(filteredDataset)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d[0]))
      .attr("cy", (d) => yScale(d[1]))
      .attr("r", 3)
      .style("fill", "#CC0000");

    const line = d3
      .line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(filteredDataset)
      .attr("class", "line")
      .attr("d", line)
      .style("fill", "none")
      .style("stroke", "#CC0000")
      .style("stroke-width", "2");

    // Add legend
    svg
      .append("circle")
      .attr("cx", width - 100)
      .attr("cy", 10)
      .attr("r", 3)
      .style("fill", "#CC0000");

    svg
      .append("text")
      .attr("x", width - 90)
      .attr("y", 10)
      .text("Data")
      .style("font-size", "12px")
      .attr("alignment-baseline", "middle");
  }, [sliderValue]);

  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
    const svg = d3.select("svg");
    svg.selectAll(".line").remove();
    svg.selectAll("circle").remove();
  };

  const calculateSliderValues = () => {
    const increment = (maxX - minX) / 4;
    const values = [minX];

    for (let i = 1; i < 4; i++) {
      values.push((minX + increment * i).toFixed(2));
    }

    values.push(maxX);
    return values;
  };

  return (
    <div>
      <label htmlFor="slider">Slider Label</label>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={handleSliderChange}
        style={{ width: "400px" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0px ",
        }}
      >
        {calculateSliderValues().map((value, index) => (
          <span key={index}>{value}</span>
        ))}
      </div>
      <svg />
    </div>
  );
}

export default LineChart;
