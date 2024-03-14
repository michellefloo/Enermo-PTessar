import React, { createContext, useState } from "react";

export const GroupSelectContext = createContext();

const GroupSelectProvider = ({children}) => {
const [selectedGroup, setSelectedGroup] = useState(-1);
const [selectedGroupName, setSelectedGroupName] = useState("");
const [selectedGroupDesc, setSelectedGroupDesc] = useState("");
const [deviceUponShow, setDeviceUponShow] = useState([]);
const [isNeedToLoading, setIsNeedToLoading] = useState(false);
  return (
    <GroupSelectContext.Provider 
        value={{
            selectedGroup,
            setSelectedGroup,
            isNeedToLoading,
            setIsNeedToLoading,
            selectedGroupName,
            setSelectedGroupName,
            selectedGroupDesc,
            setSelectedGroupDesc,
            deviceUponShow,
            setDeviceUponShow
        }}
    >
      {children}
    </GroupSelectContext.Provider>
  );
}

export default GroupSelectProvider;