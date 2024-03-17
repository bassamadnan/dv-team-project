import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { feature } from "topojson-client";
import { countryState } from "../context/CountryProvider.jsx";
import { useNavigate } from "react-router-dom";
import outgoing_refugee_data from "../utils/unhcr_outgoing_parser.js";

function Geomap() {
  console.log(outgoing_refugee_data);
  const { country, setCountry } = countryState();
  const geoRef = useRef();
  const navigate = useNavigate();
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

      // tooltip
      var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("display", "none")
        .style("background-color", "white")
        .style("color", "black")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("position", "absolute")
        .style("pointer-events", "none")
        .style("z", 10)
        .style("padding", "5px")
        .style("opacity", 0.75);

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
        .style("stroke", "black")
        .on("click", function (d, i) {
          var url = "/" + countryNames[i.id];
          navigate(url);
          setCountry(countryNames[i.id]);
        })
        .on("mouseover", (event, d) => {
          tooltip.style("display", "block").style("fill", "pink");
          console.log("mouseover", event, d);
        })
        .on("mousemove", (event, d) => {
          tooltip
            .html(countryNames[d.id])
            .style("fill", "blue")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`);
          console.log("mousemove", event, d);
        })
        .on("mouseleave", (event) => {
          tooltip.style("display", "none");
          console.log("mouseleave", event);
        });
    });
  }, []);

  useEffect(() => {
    console.log(`Country clicked ${country}`);
  }, [country]);

  return (
    <div>
      <svg className="w-[960px] h-[500px] " ref={geoRef}></svg>
    </div>
  );
}

export default Geomap;
