import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { feature } from "topojson-client";
import { countryState } from "../context/CountryProvider.jsx";
import { useNavigate } from "react-router-dom";
import {
  incoming_refugee_data,
  outgoing_refugee_data,
} from "../utils/data_parser.js";
import { sliderRight, sliderBottom } from "d3-simple-slider";

function Geomap() {
  const { country, setCountry } = countryState();
  const geoRef = useRef();
  const sliderRef = useRef();
  const dropdownRef = useRef();
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

      // color schemes
      var incomingColors = d3
        .scaleThreshold()
        .domain([0, 100, 300, 600, 1000, 3000, 6000, 10000, 100000])
        .range(d3.schemeYlGn[9]);
      var outgoingColors = d3
        .scaleThreshold()
        .domain([0, 100, 300, 600, 1000, 3000, 6000, 10000, 100000])
        .range(d3.schemeOrRd[9]);
      var netDifferenceColors = d3
        .scaleThreshold()
        .domain([0, 100, 300, 600, 1000, 3000, 6000, 10000, 100000])
        .range(d3.schemeRdPu[9]);

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

      // year slider and type of content
      var currentYear = "2000";
      var contentType = "None";
      var slider = sliderRight()
        .min(2000)
        .max(2023)
        .step(1)
        .height(400)
        .default(2000)
        .ticks(24)
        .tickFormat(d3.format("d"))
        .on("onchange", (event) => {
          currentYear = event.toString();

          g.selectAll(".country").style("fill", function (d) {
            if (contentType == "None") return "white";
            else if (contentType == "Incoming refugees")
              return incoming_refugee_data[currentYear][d.id]
                ? incomingColors(incoming_refugee_data[currentYear][d.id])
                : "white";
            else if (contentType == "Outgoing refugees")
              return outgoing_refugee_data[currentYear][d.id]
                ? outgoingColors(
                    outgoing_refugee_data[currentYear][d.id]["Count"]
                  )
                : "white";
            else {
              if (incoming_refugee_data[currentYear][d.id]) {
                if (outgoing_refugee_data[currentYear][d.id])
                  return netDifferenceColors(
                    outgoing_refugee_data[currentYear][d.id]["Count"] -
                      incoming_refugee_data[currentYear][d.id]
                  );
                else
                  return netDifferenceColors(
                    -incoming_refugee_data[currentYear][d.id]
                  );
              } else {
                if (outgoing_refugee_data[currentYear][d.id])
                  return netDifferenceColors(
                    outgoing_refugee_data[currentYear][d.id]["Count"]
                  );
                else return "white";
              }
            }
          });
        });
      var yearSlider = d3
        .select(sliderRef.current)
        .append("svg")
        .attr("class", "yearSlider")
        .attr("transform", "translate(50,50)")
        .attr("height", 500)
        .call(slider);
      var contentTypeMenu = d3
        .select(dropdownRef.current)
        .on("change", (event) => {
          contentType = event.target.value;

          g.selectAll(".country").style("fill", function (d) {
            if (contentType == "None") return "white";
            else if (contentType == "Incoming refugees")
              return incoming_refugee_data[currentYear][d.id]
                ? incomingColors(incoming_refugee_data[currentYear][d.id])
                : "white";
            else if (contentType == "Outgoing refugees")
              return outgoing_refugee_data[currentYear][d.id]
                ? outgoingColors(
                    outgoing_refugee_data[currentYear][d.id]["Count"]
                  )
                : "white";
            else {
              if (incoming_refugee_data[currentYear][d.id]) {
                if (outgoing_refugee_data[currentYear][d.id])
                  return netDifferenceColors(
                    outgoing_refugee_data[currentYear][d.id]["Count"] -
                      incoming_refugee_data[currentYear][d.id]
                  );
                else
                  return netDifferenceColors(
                    -incoming_refugee_data[currentYear][d.id]
                  );
              } else {
                if (outgoing_refugee_data[currentYear][d.id])
                  return netDifferenceColors(
                    outgoing_refugee_data[currentYear][d.id]["Count"]
                  );
                else return "white";
              }
            }
          });
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
          if (contentType == "None") return "white";
          else if (contentType == "Incoming refugees")
            return incoming_refugee_data[currentYear][d.id]
              ? incomingColors(incoming_refugee_data[currentYear][d.id])
              : "white";
          else if (contentType == "Outgoing refugees")
            return outgoing_refugee_data[currentYear][d.id]
              ? outgoingColors(
                  outgoing_refugee_data[currentYear][d.id]["Count"]
                )
              : "white";
          else {
            if (incoming_refugee_data[currentYear][d.id]) {
              if (outgoing_refugee_data[currentYear][d.id])
                return netDifferenceColors(
                  outgoing_refugee_data[currentYear][d.id]["Count"] -
                    incoming_refugee_data[currentYear][d.id]
                );
              else
                return netDifferenceColors(
                  -incoming_refugee_data[currentYear][d.id]
                );
            } else {
              if (outgoing_refugee_data[currentYear][d.id])
                return netDifferenceColors(
                  outgoing_refugee_data[currentYear][d.id]["Count"]
                );
              else return "white";
            }
          }
        })
        .style("stroke", "black")
        .on("click", function (d, i) {
          var url = "/" + countryNames[i.id];
          navigate(url);
          setCountry(countryNames[i.id]);
        })
        .on("mouseover", (event, d) => {
          tooltip.style("display", "block");
        })
        .on("mousemove", (event, d) => {
          tooltip
            .html(countryNames[d.id])
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseleave", (event) => {
          tooltip.style("display", "none");
        });
    });
  }, []);

  useEffect(() => {
    console.log(`Country clicked ${country}`);
  }, [country]);

  return (
    <div className="flex">
      <svg className="w-3/5 h-[500px]" ref={geoRef}></svg>
      <svg className="w-1/5 h-[500px]" ref={sliderRef}></svg>
      <div className="w-1/5 flex-col">
        <form className="h-1/2" defaultValue="None">
          <select ref={dropdownRef}>
            <option>None</option>
            <option>Incoming refugees</option>
            <option>Outgoing refugees</option>
            <option>Net difference</option>
          </select>
        </form>
      </div>
    </div>
  );
}

export default Geomap;
