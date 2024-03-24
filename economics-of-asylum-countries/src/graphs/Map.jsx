import { useState, useEffect } from "react";
import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { countryState } from "../context/CountryProvider";

const mapStyle = { height: "600px" };

export default function Map({ countryCode }) {
  const { ID } = countryState();
  const [map, setMap] = useState(null);
  const [geoJSON, setGeoJSON] = useState(null);
  const [centerPosition, setCenterPosition] = useState(null);

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

  return (
    <>
      {centerPosition && (
        <MapContainer
          center={centerPosition}
          zoom={3}
          style={mapStyle}
          whenCreated={(mapInstance) => setMap(mapInstance)}
        >
          {geoJSON && <GeoJSON data={geoJSON} />}
        </MapContainer>
      )}
    </>
  );
}
