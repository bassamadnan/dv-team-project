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
import { getFillColor } from "../utils/fillColor.js";
import { getTooltipContent } from "../utils/tooltipString.js";

function Geomap() {
  const { country, setCountry, setCountryID } = countryState();
  const geoRef = useRef();
  const sliderRef = useRef();
  const dropdownRef = useRef();
  const checkboxRef = useRef();
  const legendRef = useRef();

  const navigate = useNavigate();
  useEffect(() => {
    // binding the svg using useRef
    const svg = d3.select(geoRef.current);
    const parentWidth = geoRef.current.parentElement.clientWidth;
    const parentHeight = geoRef.current.parentElement.clientHeight;

    // setting up projections
    // https://d3js.org/d3-geo/cylindrical  geoEquirectangular, geoMercator,geoNaturalEarth1
    const projection = d3
      .geoEquirectangular()
      .fitSize([parentWidth, parentHeight], { type: "Sphere" });
    const pathGenerator = d3.geoPath().projection(projection);
    svg.selectAll("*").remove();

    svg.attr("width", parentWidth).attr("height", parentHeight);

    const g = svg.append("g");

    // the background, this forms the ocean area
    g.append("path")
      .attr("class", "sphere")
      .attr("d", pathGenerator({ type: "Sphere" }));

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
        .domain([0, 3000, 10000, 50000, 100000, 500000, 1500000])
        .range(d3.schemeYlGn[7]);
      var outgoingColors = d3
        .scaleThreshold()
        .domain([0, 1000, 4000, 10000, 160000])
        .range(d3.schemeOrRd[5]);
      var netDifferenceColors = d3
        .scaleThreshold()
        .domain([-1500000, -100000, -10000, 0, 10000, 100000, 1500000])
        .range(d3.schemeRdPu[7]);
      var incomingColorsGrey = d3
        .scaleThreshold()
        .domain([0, 3000, 10000, 50000, 100000, 500000, 1500000])
        .range(d3.schemeGreys[7]);
      var outgoingColorsGrey = d3
        .scaleThreshold()
        .domain([0, 1000, 4000, 10000, 160000])
        .range(d3.schemeGreys[5]);
      var netDifferenceColorsGrey = d3
        .scaleThreshold()
        .domain([-1500000, -100000, -10000, 0, 10000, 100000, 1500000])
        .range(d3.schemeGreys[7]);

      // tooltip
      var tooltip = d3.select("body").append("div").attr("class", "tooltip");

      var currentYear = "2000";
      var contentType = "None";
      var greyOrColor = "color";
      var legendData, legendColors;

      // year slider
      var slider = sliderRight()
        .min(2000)
        .max(2024)
        .step(1)
        .height(400)
        .default(2000)
        .ticks(24)
        .tickFormat(d3.format("d"))
        .on("onchange", (event) => {
          currentYear = event.toString();

          g.selectAll(".country")
            .transition()
            .duration(500)
            .style("fill", function (d) {
              return getFillColor(
                contentType,
                currentYear,
                greyOrColor,
                incomingColors,
                outgoingColors,
                netDifferenceColors,
                incomingColorsGrey,
                outgoingColorsGrey,
                netDifferenceColorsGrey,
                d
              );
            });
        });
      d3.select(sliderRef.current).selectAll(".yearSlider").remove();

      var yearSlider = d3
        .select(sliderRef.current)
        .append("svg")
        .attr("class", "yearSlider")
        .attr("height", 750)
        .call(slider);

      yearSlider.selectAll(".tick text").attr("fill", "black");

      // type of content
      var contentTypeMenu = d3
        .select(dropdownRef.current)
        .on("change", (event) => {
          contentType = event.target.value;

          g.selectAll(".country")
            .transition()
            .duration(500)
            .style("fill", function (d) {
              return getFillColor(
                contentType,
                currentYear,
                greyOrColor,
                incomingColors,
                outgoingColors,
                netDifferenceColors,
                incomingColorsGrey,
                outgoingColorsGrey,
                netDifferenceColorsGrey,
                d
              );
            });

          switch (contentType) {
            case "Incoming refugees":
              legendData = incomingColors.domain();
              legendColors =
                greyOrColor == "grey"
                  ? incomingColorsGrey.range()
                  : incomingColors.range();
              break;
            case "Outgoing refugees":
              legendData = outgoingColors.domain();
              legendColors =
                greyOrColor == "grey"
                  ? outgoingColorsGrey.range()
                  : outgoingColors.range();
              break;
            case "Net difference":
              legendData = netDifferenceColors.domain();
              legendColors =
                greyOrColor == "grey"
                  ? netDifferenceColorsGrey.range()
                  : netDifferenceColors.range();
              break;
            default:
              legendData = [0];
              legendColors = ["#ffffff"];
              break;
          }

          g2.selectAll("*").remove();

          g2.selectAll("path")
            .data(legendData)
            .enter()
            .append("circle")
            .attr("cx", 20)
            .attr("cy", function (d, i) {
              return 20 + i * 25;
            })
            .attr("r", 8)
            .attr("fill", function (d, i) {
              return legendColors[i];
            })
            .attr("stroke", "black")
            .attr("position", "relative");
          g2.selectAll("label")
            .data(legendData)
            .enter()
            .append("text")
            .attr("x", 40)
            .attr("y", function (d, i) {
              return 25 + i * 25;
            })
            .attr("font-size", "16px")
            .text(function (d, i) {
              if (contentType == "None") return "0";
              if (i == legendData.length - 1) return d + "+";
              else return d + " - " + legendData[i + 1];
            });
        });

      // greyscale or colored
      var greyOrColorOption = d3
        .select(checkboxRef.current)
        .on("change", (event) => {
          greyOrColor = greyOrColor == "color" ? "grey" : "color";

          g.selectAll(".country")
            .transition()
            .duration(500)
            .style("fill", function (d) {
              return getFillColor(
                contentType,
                currentYear,
                greyOrColor,
                incomingColors,
                outgoingColors,
                netDifferenceColors,
                incomingColorsGrey,
                outgoingColorsGrey,
                netDifferenceColorsGrey,
                d
              );
            });

          switch (contentType) {
            case "Incoming refugees":
              legendData = incomingColors.domain();
              legendColors =
                greyOrColor == "grey"
                  ? incomingColorsGrey.range()
                  : incomingColors.range();
              break;
            case "Outgoing refugees":
              legendData = outgoingColors.domain();
              legendColors =
                greyOrColor == "grey"
                  ? outgoingColorsGrey.range()
                  : outgoingColors.range();
              break;
            case "Net difference":
              legendData = netDifferenceColors.domain();
              legendColors =
                greyOrColor == "grey"
                  ? netDifferenceColorsGrey.range()
                  : netDifferenceColors.range();
              break;
            default:
              legendData = [0];
              legendColors = ["#ffffff"];
              break;
          }

          g2.selectAll("path")
            .data(legendData)
            .enter()
            .append("circle")
            .attr("cx", 20)
            .attr("cy", function (d, i) {
              return 20 + i * 25;
            })
            .attr("r", 8)
            .attr("fill", function (d, i) {
              return legendColors[i];
            })
            .attr("stroke", "black")
            .attr("position", "relative");
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
          return getFillColor(
            contentType,
            currentYear,
            greyOrColor,
            incomingColors,
            outgoingColors,
            netDifferenceColors,
            incomingColorsGrey,
            outgoingColorsGrey,
            netDifferenceColorsGrey,
            d
          );
        })
        .on("click", function (d, i) {
          var url = "/" + countryNames[i.id];
          navigate(url);
          tooltip.style("display", "none");
          setCountry(countryNames[i.id]);
          setCountryID(i.id);
        })
        .on("mouseover", function (event, d) {
          tooltip.style("display", "block");
          d3.select(this) // to be used without arrow functions !
            .transition()
            .duration(200)
            .style("stroke", "black")
            .style("stroke-width", "3px");
        })
        .on("mousemove", (event, d) => {
          var content = getTooltipContent(contentType, currentYear, d);
          tooltip
            .html(
              contentType == "None"
                ? countryNames[d.id]
                : countryNames[d.id] +
                    "<br>" +
                    contentType +
                    ": " +
                    content +
                    "<br>" +
                    (contentType == "Net difference"
                      ? "Incoming refugees : " +
                        getTooltipContent("Incoming refugees", currentYear, d) +
                        "<br> Outgoing refugees : " +
                        getTooltipContent("Outgoing refugees", currentYear, d)
                      : "")
            )
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseleave", function (event) {
          tooltip.style("display", "none");
          d3.select(this)
            .transition()
            .duration(200)
            .style("stroke", "black")
            .style("stroke-width", "1px");
        });

      switch (contentType) {
        case "Incoming refugees":
          legendData = incomingColors.domain();
          legendColors =
            greyOrColor == "grey"
              ? incomingColorsGrey.range()
              : incomingColors.range();
          break;
        case "Outgoing refugees":
          legendData = outgoingColors.domain();
          legendColors =
            greyOrColor == "grey"
              ? outgoingColorsGrey.range()
              : outgoingColors.range();
          break;
        case "Net difference":
          legendData = netDifferenceColors.domain();
          legendColors =
            greyOrColor == "grey"
              ? netDifferenceColorsGrey.range()
              : netDifferenceColors.range();
          break;
        default:
          legendData = [0];
          legendColors = ["#ffffff"];
          break;
      }

      var g2 = d3.select(legendRef.current).append("g");
      g2.selectAll("path")
        .data(legendData)
        .enter()
        .append("circle")
        .attr("cx", 20)
        .attr("cy", function (d, i) {
          return 20 + i * 25;
        })
        .attr("r", 8)
        .attr("fill", function (d, i) {
          return legendColors[i];
        })
        .attr("stroke", "black")
        .attr("position", "relative");
      g2.selectAll("label")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", 40)
        .attr("y", function (d, i) {
          return 25 + i * 25;
        })
        .attr("font-size", "16px")
        .text(function (d, i) {
          if (contentType == "None") return "0";
          if (i == legendData.length - 1) return d + "+";
          else return d + " - " + legendData[i + 1];
        });
    });
  }, []);

  return (
    <div
      className=""
      style={{ position: "relative", width: "100vw", height: "100vh" }}
    >
      <svg ref={geoRef}></svg>

      <div
        className="flex flex-col"
        style={{
          position: "absolute",
          top: "300px",
          left: "10px",
          color: "black",
        }}
      >
        <form className="h-1/2" defaultValue="None" style={{ width: "auto" }}>
          <select ref={dropdownRef}>
            <option>None</option>
            <option>Incoming refugees</option>
            <option>Outgoing refugees</option>
            <option>Net difference</option>
          </select>
          <label className="switch">
            <input type="checkbox" ref={checkboxRef}></input>
            <span className="slider round"></span>
          </label>
        </form>
        <div>
          <svg className="h-[600px] mt-[50px]" ref={sliderRef}></svg>
        </div>
        <svg
          id="legend"
          style={{
            position: "absolute",
            top: "500px",
            left: "5px",
            height: "195px",
            width: "175px",
            border: "2px solid black",
            borderRadius: "10px",
          }}
          ref={legendRef}
        ></svg>
      </div>
    </div>
  );
}

export default Geomap;
