import { createContext, useContext, useState, useEffect } from "react";
import { gdp_data } from "../utils/data_parser";

// keeps track of the country selected 

const CountryContext = createContext();

const CountryProvider = ({children}) => {
    const [country, setCountry] = useState(null);
    const [ID, setCountryID] = useState(null);
    const [year, setYear] = useState("2000");
    const [currData, setCurrData] = useState(gdp_data);
    return (
        <CountryContext.Provider
            value={{
                country,
                setCountry,
                ID, 
                setCountryID, currData,
                setCurrData
            }}
        >
            {children}
        </CountryContext.Provider>
    )
};

export const countryState = () => {
    return useContext(CountryContext);
};

export default CountryProvider;