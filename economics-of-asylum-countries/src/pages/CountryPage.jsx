import React from 'react'
import { countryState } from '../context/CountryProvider'

const CountryPage = () => {
    const {country} = countryState();
    
  return (
    <h1>
        Rendering Country {`${country}`}
    </h1>
  )
}

export default CountryPage