import React, { useEffect, useState, useContext } from "react";
import { useGetDeviceMonitoring } from "../../../../api/dashboard";
import { TimeConfigProviderContext } from "src/views/dashboard/_provider/TimeConfigProvider";

const Temp = ({ id_device, param }) => {
  const { deviceMonitorTime } = useContext(TimeConfigProviderContext);
  const { data, status } = useGetDeviceMonitoring(
    id_device,
    param,
    deviceMonitorTime.start,
    deviceMonitorTime.end
  );
  const [numbersTemp, setNumberTemp] = useState(0);
  useEffect(() => {
    if (status === "success") {
      if (!data) return setNumberTemp(0);
      if (!data.result) return setNumberTemp(0);
      const filtered = data.result.filter((item) => item.type === param);
      const resultLength = filtered.length;
      if (resultLength === 0) return setNumberTemp("-");
      return setNumberTemp(filtered[resultLength - 1][param]);
    }
  }, [data, status, param]);
  if (status !== "success") return "...";
  return <>{numbersTemp} C</>;
};

export default Temp;
