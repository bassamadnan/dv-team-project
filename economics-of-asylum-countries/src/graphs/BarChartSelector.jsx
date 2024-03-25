import React, { useState } from 'react'
import { gdp_data, ggxwdn_data, incoming_refugee_data, lur_data, outgoing_refugee_data, pcpipch_data, pppgdp_data, ppppc_data } from '../utils/data_parser'
import { countryState } from '../context/CountryProvider';


const BarChartSelector = () => {
    const {setCurrData} = countryState();
    const dataOptions = [
      { label: 'GDP Data', value: gdp_data },
      { label: 'Purchasing Power Parity per Capita Data', value: ppppc_data },
      { label: 'Purchasing Power Parity GDP Data', value: pppgdp_data },
      { label: 'Labour Underutilization Rate Data', value: lur_data },
      { label: 'GGXWDN NGDP Data', value: ggxwdn_data },
      { label: 'Price Change of High Technology Products Data', value: pcpipch_data }
    ];
  
    const [selectedData, setSelectedData] = useState(null);
  
    const handleChange = (event) => {
      const selectedValue = event.target.value;
      const selectedOption = dataOptions.find(option => option.label === selectedValue);
      setSelectedData(selectedOption.value);
      setCurrData(selectedOption.value);
    //   console.log(selectedOption);
    };
  
    return (
      <div>
        <select onChange={handleChange}>
          {dataOptions.map(option => (
            
            <option key={option.label} value={option.label}>{option.label}</option>
          ))}
        </select>
      </div>
    );
  }
  
  export default BarChartSelector;