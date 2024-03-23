import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

const CountryMap = () => {

        
    const mapRef = useRef(null);

    useEffect(() => {
        Promise.all([
        d3.tsv("https://unpkg.com/world-atlas@1.1.4/world/50m.tsv"),
        d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json"),
        ]).then(([tsvData, topoJsonData]) => {
        

        const width = 800;
        const height = 600;

        const svg = d3
            .select(mapRef.current)
            .attr("width", width)
            .attr("height", height);

        const projection = d3
            .geoMercator()
            .scale(120)
            .translate([width / 2, height / 2]);
        const pathGenerator = d3.geoPath().projection(projection);

        const geoJsonData = feature(topoJsonData, topoJsonData.objects.countries);

        const americaData = geoJsonData.features.find((d) => d.id === "356");
        console.log(americaData);
        svg
            .selectAll(".country")
            .data([americaData])
            .join("path")
            .attr("class", "country")
            .attr("d", pathGenerator)
            .attr("fill", "steelblue")
            .attr("stroke", "black");
        });
    }, []);

    return <svg ref={mapRef}></svg>;
};

export default CountryMap;
