import React, { useEffect, useState, useContext } from "react";
import { useGetSensorByIddDeviceList } from "src/api/sensor";
import { useGetLocationMonitoring } from "../../../../api/dashboard";
import { TimeConfigProviderContext } from "../../_provider/TimeConfigProvider";
import CIcon from "@coreui/icons-react";
import { cilLocationPin, cilXCircle } from "@coreui/icons";

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
      const filteredLatData = data.result[0].locations_sensors.lat;
      const filteredLonData = data.result[0].locations_sensors.lon;
      if (!filteredLatData || filteredLatData === 0) return;
      if (!filteredLonData || filteredLonData === 0) return;
      setGpsCoordinate({
        lat: filteredLatData,
        lon: filteredLonData,
      });
    }
  }, [data, status, sensorStatus, sensorData]);
  return (
    <>
      <CIcon
        content={gpsCoordinate ? cilLocationPin : cilXCircle}
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
