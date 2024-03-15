import React, { useEffect, useState, useContext } from "react";
import { useGetSensorByIddDeviceList } from "src/api/sensor";
import {
  useGetDeviceMonitoring,
  useGetLocationMonitoring,
} from "../../../../api/dashboard";
import { TimeConfigProviderContext } from "../../_provider/TimeConfigProvider";
import CIcon from "@coreui/icons-react";
import { cilLocationPin } from "@coreui/icons";

export const Gps1 = ({ id_device, types }) => {
  const { locationMonitorTime } = useContext(TimeConfigProviderContext);
  const { data: sensorData, status: sensorStatus } =
    useGetSensorByIddDeviceList(id_device);
  const { data, status } = useGetLocationMonitoring(
    id_device,
    locationMonitorTime.start,
    locationMonitorTime.end,
    types
  );
  const [gpsCoordinate, setGpsCoordinate] = useState(null);
  useEffect(() => {
    if (status === "success" && sensorStatus === "success") {
      if (!data) return;
      if (!data.result) return;
      if (data.result.length === 0) return;
      console.log(data.result);
      const filteredLatData = data.result[0].locations_sensors.lat;
      //   const lastLatData = filteredLatData[filteredLatData.length - 1];
      const filteredLonData = data.result[0].locations_sensors.lon;
      //   const lastLonData = filteredLonData[filteredLonData.length - 1];
      if (!filteredLatData) return;
      if (!filteredLonData) return;
      setGpsCoordinate({
        lat: filteredLatData.value,
        lon: filteredLonData.value,
      });
    }
  }, [data, status, sensorStatus, sensorData]);
  return (
    <>
      <CIcon
        content={cilLocationPin}
        className={gpsCoordinate ? "text-success" : "text-muted"}
        style={{
          cursor: gpsCoordinate ? "pointer" : "default",
          marginRight: "5px",
          marginTop: "-7px",
        }}
        onClick={() => {
          gpsCoordinate &&
            window.open(
              `https://www.google.com/maps?q=loc:@${gpsCoordinate.lat},${gpsCoordinate.lon}`,
              "_blank"
            );
        }}
      />
    </>
  );
};

export default Gps1;
