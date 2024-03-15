import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { feature } from "topojson-client";

function Geomap() {
  const geoRef = useRef();

  useEffect(() => {
    // binding the svg using useRef
    const svg = d3.select(geoRef.current);

    // setting up projections
    const projection = d3.geoMercator();
    const pathGenerator = d3.geoPath().projection(projection);

    const g = svg.append("g");

    // the background, this forms the ocean area
    g.append("path")
      .attr("class", "sphere")
      .attr("d", pathGenerator({ type: "Sphere" }))
      .style("fill", "#b7ddf4");

    // parsing the country mapping data
    Promise.all([
      d3.tsv("https://unpkg.com/world-atlas@1.1.4/world/50m.tsv"),
      d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json"),
    ]).then(([tsvData, topoJsonData]) => {
      const countryNames = {};
      tsvData.forEach((d) => {
        countryNames[d.iso_n3] = d.name;
      });

      // rendering the paths for each country
      const countries = feature(topoJsonData, topoJsonData.objects.countries);
      g.selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", pathGenerator)
        .style("fill", function (d) {
          var gr = parseInt(d.id);
          // fake category based on even or odd id
          return gr % 2 == 1 ? "lightGreen" : "indianRed";
        })
        .style("stroke", "black");
    });
  }, []);

  return (
    <div>
      <svg className="w-[960px] h-[500px] " ref={geoRef}></svg>
    </div>
  );
}

export default Geomap;
