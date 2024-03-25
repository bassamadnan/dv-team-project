import { useState, useEffect, useRef } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as d3 from "d3";
import L from "leaflet";
import { countryState } from "../context/CountryProvider";
import { sliderBottom, sliderRight } from "d3-simple-slider";
import { getFillColor } from "../utils/fillColor";

const mapStyle = { height: "600px" };

export default function Map({ countryCode }) {
  const { ID } = countryState();
  const [map, setMap] = useState(null);
  const [geoJSON, setGeoJSON] = useState(null);
  const [centerPosition, setCenterPosition] = useState(null);
  const sliderRef = useRef(null);
  const [sliderValue, setSliderValue] = useState(2000);
  const [contentType, setContentType] = useState("None");
  const dropdownRef = useRef(null);
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

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch(
          `https://cdn.rawgit.com/johan/world.geo.json/34c96bba/countries/${countryCode}.geo.json`
        );
        const data = await response.json();
        setGeoJSON(data);
      } catch (error) {
        console.error("GeoJSON error:", error);
      }
    };
    fetchGeoJSON();
  }, [countryCode]);

  useEffect(() => {
    if (geoJSON) {
      const ukLayer = L.geoJSON(geoJSON);
      const bounds = ukLayer.getBounds();
      if (bounds.isValid()) {
        const center = bounds.getCenter();
        setCenterPosition([center.lat, center.lng]);
      }
    }
  }, [geoJSON, ID]);

  useEffect(() => {
    if (sliderRef.current) {
      var slider = sliderBottom()
        .min(2000)
        .max(2023)
        .step(1)
        .width(600)
        .default(2000)
        .ticks(24)
        .tickFormat(d3.format("d"))
        .on("onchange", (val) => {
          setSliderValue(val);
        });

      d3.select(sliderRef.current).selectAll(".yearSlider").remove();

      var yearSlider = d3
        .select(sliderRef.current)
        .append("svg")
        .attr("class", "yearSlider")
        .attr("width", 650)
        .call(slider);

      yearSlider.selectAll(".tick text").attr("fill", "black");
    }
  }, []);

  const getCountryColor = () => {
    const sval = sliderValue.toString()
    const temp_dict = {id: ID};
    return getFillColor(contentType, sval, incomingColors, outgoingColors, netDifferenceColors, temp_dict);
   
  };

  const countryStyle = (feature) => {
    return {
      fillColor: getCountryColor(),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  };

  const handleContentTypeChange = (event) => {
    setContentType(event.target.value);
  };

  return (
    <>
      {centerPosition && (
        <MapContainer
          center={centerPosition}
          zoom={3}
          style={mapStyle}
          whenCreated={(mapInstance) => setMap(mapInstance)}
        >
          {geoJSON && <GeoJSON data={geoJSON} style={countryStyle} />}
        </MapContainer>
      )}
      <div
        ref={sliderRef}
        style={{ marginTop: "20px", marginLeft: "100px" }}
      ></div>
      <select
        value={contentType}
        onChange={handleContentTypeChange}
        ref={dropdownRef}
      >
        <option value="None">None</option>
        <option value="Incoming refugees">Incoming refugees</option>
        <option value="Outgoing refugees">Outgoing refugees</option>
        <option value="Net difference">Net difference</option>
      </select>
    </>
  );
}
