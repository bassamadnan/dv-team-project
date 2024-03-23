import { createContext, useContext, useState, useEffect } from "react";

const CountryContext = createContext();

const CountryProvider = ({children}) => {
    const [country, setCountry] = useState(null);
    const [ID, setCountryID] = useState(null);

    return (
        <CountryContext.Provider
            value={{
                country,
                setCountry,
                ID, 
                setCountryID
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