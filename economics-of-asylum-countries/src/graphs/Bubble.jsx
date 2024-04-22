// import React, { useState, useEffect, useRef } from "react";
// import * as d3 from "d3";
// import { lur_data } from "../utils/data_parser";
// import { countryState } from "../context/CountryProvider";
// import { conversion_country } from "../utils/data_parser";

// const GroupVisualization = () => {
//   const { ID } = countryState();
//   const [selectedYear, setSelectedYear] = useState("2023");
//   const years = [
//     "2008",
//     "2009",
//     "2010",
//     "2011",
//     "2012",
//     "2013",
//     "2014",
//     "2015",
//     "2016",
//     "2017",
//     "2018",
//     "2019",
//     "2020",
//     "2021",
//     "2022",
//     "2023",
//   ];
//   const svgRef = useRef();
//   const legendRef = useRef();

//   useEffect(() => {
//     // Initial draw when component mounts
//     drawBubbleChart(selectedYear);
//     drawLegend();
//   }, [selectedYear]);

//   useEffect(() => {
//     const svg = d3.select(svgRef.current);
//     svg.selectAll("*").remove(); // Clear previous chart
//     drawBubbleChart(selectedYear);
//     drawLegend();
//   }, [selectedYear]);

//   const drawBubbleChart = (year) => {
//     // Extracting data for the selected year
//     const data = Object.entries(lur_data).map(([country, values]) => ({
//       country,
//       value: values[year] || 0, // If no value exists for the year, default to 0
//     }));

//     const svg = d3.select(svgRef.current);

//     // Define the scales for mapping data to visual properties
//     const radiusScale = d3
//       .scaleSqrt()
//       .domain([0, d3.max(data, (d) => d.value)])
//       .range([2, 20]);

//     // Define color scale based on data values
//     const colorScale = d3
//       .scaleSequential(d3.interpolateBlues)
//       .domain([0, d3.max(data, (d) => d.value)]);

//     const simulation = d3
//       .forceSimulation(data)
//       .force("charge", d3.forceManyBody().strength(+10))
//       .force("center", d3.forceCenter(700, 500))
//       .force(
//         "collide",
//         d3.forceCollide().radius((d) => radiusScale(d.value) + 18) // Adjust the collision detection radius
//       )
//       .on("tick", ticked);

//     const g = svg.append("g");

//     function ticked() {
//       const circles = g
//         .selectAll("circle")
//         .data(data)
//         .join("circle")
//         .attr("r", (d) => {
//           // Set the radius based on the value, but if the value is small, null, or zero, set a minimum radius
//           if (d.value < 1) {
//             return 20;
//           }
//           return radiusScale(d.value * 1.8);
//         })
//         .attr("fill", (d) => {
//           // Set fill color based on value
//           if (d.country === ID) {
//             return "yellow"; // Yellow fill for highlighted country
//           } else if (d.value < 1) {
//             return "none"; // Empty circle
//           }
//           return colorScale(d.value);
//         })
//         .attr("stroke", (d) => {
//           // Set stroke color based on value
//           if (d.country === ID) {
//             return "none"; // No stroke for highlighted country
//           } else if (d.value < 1) {
//             return "red"; // Red stroke for empty circles
//           }
//           return "none"; // No stroke for filled circles
//         })
//         .attr("stroke-width", 2) // Set stroke width for non-highlighted circles
//         .attr("cx", (d) => d.x)
//         .attr("cy", (d) => d.y)
//         .call(
//           d3
//             .drag()
//             .on("start", dragstarted)
//             .on("drag", dragged)
//             .on("end", dragended)
//         )
//         .append("title") // Add a title element to show the country name and value on hover
//         .text((d) => `${conversionCountry[d.country]}: ${d.value}`);

//       const labels = g
//         .selectAll("text")
//         .data(data)
//         .join("text")
//         .text((d) => d.country)
//         .attr("text-anchor", "middle")
//         .style("fill", "black") // Set text color to white
//         .attr("dy", ".35em")
//         .attr("x", (d) => d.x)
//         .attr("y", (d) => d.y);
//     }

//     function dragstarted(event, d) {
//       if (!event.active) simulation.alphaTarget(0.3).restart();
//       d.fx = d.x;
//       d.fy = d.y;
//     }

//     function dragged(event, d) {
//       // Calculate the new position within the SVG boundaries
//       const newX = Math.max(
//         radiusScale(d.value),
//         Math.min(2000 - radiusScale(d.value), event.x)
//       );
//       const newY = Math.max(
//         radiusScale(d.value),
//         Math.min(1000 - radiusScale(d.value), event.y)
//       );

//       // Update the position of the circle and its label
//       d.fx = newX;
//       d.fy = newY;

//       // Update the position of the circle within SVG boundaries
//       d3.select(this)
//         .attr("cx", (d) => d.fx)
//         .attr("cy", (d) => d.fy);
//       d3.select(this.nextSibling)
//         .attr("x", (d) => d.fx)
//         .attr("y", (d) => d.fy);
//     }

//     function dragended(event, d) {
//       if (!event.active) simulation.alphaTarget(0);
//       d.fx = null;
//       d.fy = null;
//     }
//   };

//   const changeStackCountry = (event) => {
//     const year = event.target.value;
//     setSelectedYear(year);
//   };
//   const drawLegend = () => {
//     const legendSvg = d3.select(legendRef.current);

//     const legendWidth = 500; // Adjust as needed
//     const legendHeight = 500; // Adjust as needed
//     const svgWidth = 1800; // Width of the main SVG
//     const svgHeight = 900; // Height of the main SVG
//     const margin = 1; // Margin between legend and SVG

//     const legend = legendSvg
//       .selectAll(".legend")
//       .data(["Low Value", "High Value"])
//       .enter()
//       .append("g")
//       .attr("class", "legend")
//       .attr(
//         "transform",
//         (d, i) =>
//           `translate(${svgWidth - legendWidth - margin}, ${margin + i * 20})`
//       );

//     legend
//       .append("circle")
//       .attr("cx", 10)
//       .attr("cy", 10)
//       .attr("r", 5)
//       .attr("fill", (d, i) => (i === 0 ? "none" : d3.interpolateBlues(1)));

//     legend
//       .append("text")
//       .attr("x", 20)
//       .attr("y", 10)
//       .attr("dy", "0.35em")
//       .text((d) => d)
//       .style("fill", "red");
//   };

//   const legendStyle = {
//     position: "absolute",
//     top: "20px", // Adjust as needed
//     right: "20px", // Adjust as needed
//   };

//   return (
//     <div className="dropdown">
//       <div style={{ display: "flex" }}>
//         <div style={{ width: "300px" }} />
//         <label htmlFor="bubbleChartSelectYear">Select A Year: </label>
//         <div style={{ textAlign: "center" }} className="select">
//           <select
//             id="bubbleChartSelectYear"
//             onChange={changeStackCountry}
//             value={selectedYear}
//           >
//             {years.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       <svg width="1800" height="1000" ref={svgRef} />
//       <svg width="500" height="500" ref={legendRef} />
//     </div>
//   );
// };

// export default GroupVisualization;


import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { lur_data } from "../utils/data_parser";
import { countryState } from "../context/CountryProvider";
import { conversion_country } from "../utils/data_parser"; // Import conversion_country

const GroupVisualization = () => {
  const { ID } = countryState();
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
  const legendRef = useRef();

  useEffect(() => {
    // Initial draw when component mounts
    drawBubbleChart(selectedYear);
    drawLegend();
  }, [selectedYear]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous chart
    drawBubbleChart(selectedYear);
    drawLegend();
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

    // Define color scale based on data values
    const colorScale = d3
      .scaleSequential(d3.interpolateBlues)
      .domain([0, d3.max(data, (d) => d.value)]);

    const simulation = d3
      .forceSimulation(data)
      .force("charge", d3.forceManyBody().strength(+10))
      .force("center", d3.forceCenter(700, 500))
      .force(
        "collide",
        d3.forceCollide().radius((d) => radiusScale(d.value) + 18) // Adjust the collision detection radius
      )
      .on("tick", ticked);

    const g = svg.append("g");

    function ticked() {
      const circles = g
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", (d) => {
          // Set the radius based on the value, but if the value is small, null, or zero, set a minimum radius
          if (d.value < 1) {
            return 20;
          }
          return radiusScale(d.value * 1.8);
        })
        .attr("fill", (d) => {
          // Set fill color based on value
          if (d.country === ID) {
            return "yellow"; // Yellow fill for highlighted country
          } else if (d.value < 1) {
            return "none"; // Empty circle
          }
          return colorScale(d.value);
        })
        .attr("stroke", (d) => {
          // Set stroke color based on value
          if (d.country === ID) {
            return "none"; // No stroke for highlighted country
          } else if (d.value < 1) {
            return "red"; // Red stroke for empty circles
          }
          return "none"; // No stroke for filled circles
        })
        .attr("stroke-width", 2) // Set stroke width for non-highlighted circles
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        )
        .append("title") // Add a title element to show the country name and value on hover
        .text((d) => `${conversion_country[d.country]}: ${d.value}`); // Use conversion_country to get country name

      const labels = g
        .selectAll("text")
        .data(data)
        .join("text")
        .text((d) => conversion_country[d.country]) // Display country name
        .attr("text-anchor", "middle")
        .style("fill", "black") // Set text color to white
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

      // Update the position of the circle within SVG boundaries
      d3.select(this)
        .attr("cx", (d) => d.fx)
        .attr("cy", (d) => d.fy);
      d3.select(this.nextSibling)
        .attr("x", (d) => d.fx)
        .attr("y", (d) => d.fy);
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
  const drawLegend = () => {
    const legendSvg = d3.select(legendRef.current);

    const legendWidth = 500; // Adjust as needed
    const legendHeight = 500; // Adjust as needed
    const svgWidth = 1800; // Width of the main SVG
    const svgHeight = 900; // Height of the main SVG
    const margin = 1; // Margin between legend and SVG

    const legend = legendSvg
      .selectAll(".legend")
      .data(["Low Value", "High Value"])
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        (d, i) =>
          `translate(${svgWidth - legendWidth - margin}, ${margin + i * 20})`
      );

    legend
      .append("circle")
      .attr("cx", 10)
      .attr("cy", 10)
      .attr("r", 5)
      .attr("fill", (d, i) => (i === 0 ? "none" : d3.interpolateBlues(1)));

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", 10)
      .attr("dy", "0.35em")
      .text((d) => d)
      .style("fill", "red");
  };

  const legendStyle = {
    position: "absolute",
    top: "20px", // Adjust as needed
    right: "20px", // Adjust as needed
  };

  return (
    <div className="dropdown">
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
      <svg width="1800" height="1000" ref={svgRef} />
      <svg width="500" height="500" ref={legendRef} />
    </div>
  );
};

export default GroupVisualization;
