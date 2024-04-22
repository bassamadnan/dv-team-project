import { createContext, useContext, useState, useEffect } from "react";
import { gdp_data, lur_data } from "../utils/data_parser";

// keeps track of the country selected

const CountryContext = createContext();

const CountryProvider = ({ children }) => {
  const [country, setCountry] = useState(null);
  const [ID, setCountryID] = useState(null);
  const [year, setYear] = useState("2000");
  const [currBarData, setCurrBarData] = useState(gdp_data);
  const [currLineData, setCurrLineData] = useState(lur_data);
  const [countryView, setCountryView] = useState("SingleCountry");
  return (
    <CountryContext.Provider
      value={{
        country,
        setCountry,
        ID,
        setCountryID,
        currBarData,
        setCurrBarData,
        currLineData,
        setCurrLineData,
        countryView,
        setCountryView,
        year,
        setYear
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};

export const countryState = () => {
  return useContext(CountryContext);
};

export default CountryProvider;
