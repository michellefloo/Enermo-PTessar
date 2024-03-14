import React, { createContext, useState } from "react";
import { useLocation } from "react-router-dom";

export const DeviceHistoryContext = createContext();

const DeviceHistoryProvider = ({children}) => {
  const location = useLocation()
  const [selectedDevice] = useState({
    id: location.state? location.state.device_id : -1,
    device: location.state? location.state.device : {},
    name: location.state? location.state.device_name : ""
  });
  const [isNeedToLoading, setIsNeedToLoading] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  // const [selectedLocation, setSelectedLocation] = useState(null);
    return (
      <DeviceHistoryContext.Provider 
          value={{
              selectedDevice,
              isNeedToLoading,
              setIsNeedToLoading,
              selectedStartDate,
              setSelectedStartDate,
              selectedEndDate,
              setSelectedEndDate,
              // selectedLocation,
              // setSelectedLocation
          }}
      >
        {children}
      </DeviceHistoryContext.Provider>
    );
}
export default DeviceHistoryProvider;