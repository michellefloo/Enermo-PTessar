import React, { createContext, useState } from "react";

export const DeviceSelectContext = createContext();

const DeviceSelectProvider = ({children}) => {
const [selectedDevice, setSelectedDevice] = useState(-1);
const [selectedDeviceName, setSelectedDeviceName] = useState("");
const [isNeedToLoading, setIsNeedToLoading] = useState(false);
  return (
    <DeviceSelectContext.Provider 
        value={{
            selectedDevice,
            setSelectedDevice,
            isNeedToLoading,
            setIsNeedToLoading,
            selectedDeviceName,
            setSelectedDeviceName
        }}
    >
      {children}
    </DeviceSelectContext.Provider>
  );
}

export default DeviceSelectProvider;