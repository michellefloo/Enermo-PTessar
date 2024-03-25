import React, { useState, useEffect, useContext } from "react";
import { useGetSensorByIddDeviceList } from "../../../../api/sensor";
import { useGetLastDeviceInstallByIddDeviceList } from "../../../../api/device-installation";
import { DEVICE_PARAMS_CONST } from "../../../../utils/constant";
import { useGetBoundaryList } from "../../../../api/boundary";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBuilding } from "@coreui/icons";
import BigSpinner from "../../../../components/ui/big-spinner/BigSpinner";
import { Kwh, Status, Hum, Temp, CycleActivePower, Gps } from "../parameters";
import LiveSensorChart from "../Chart";
import { DeviceSummaryChartContext } from "../../_provider/DeviceSummaryChartProvider";

const DeviceSummaryCardFactory = () => {
  const { selectedDevice } = useContext(DeviceSummaryChartContext);
  const id_device = selectedDevice.id;
  const { data: deviceInstallData } =
    useGetLastDeviceInstallByIddDeviceList(id_device);
  const { data: sensorData, status: sensorStatus } =
    useGetSensorByIddDeviceList(id_device);
  const { data: boundaryData } = useGetBoundaryList({ withBoundary: true });
  const [availableParams, setAvailableParams] = useState([]);

  useEffect(() => {
    const getComponentBasedOnSensorType = (sensorType) => {
      switch (sensorType) {
        case "edel":
          return <Kwh id_device={id_device} param={sensorType} />;
        case "tem1":
          return <Temp id_device={id_device} param={sensorType} />;
        case "tem2":
          return <Temp id_device={id_device} param={sensorType} />;
        case "hum1":
          return <Hum id_device={id_device} param={sensorType} />;
        case "hum2":
          return <Hum id_device={id_device} param={sensorType} />;
        case "ptot":
          return <CycleActivePower param={sensorType} />;
        default:
          return null;
      }
    };

    if (sensorStatus === "success") {
      const params = [];
      if (!sensorData) return;
      if (!sensorData.result) return;
      sensorData.result.forEach((sensor) => {
        if (sensor.sensor_type_parameter in DEVICE_PARAMS_CONST) {
          params.push({
            type: DEVICE_PARAMS_CONST[sensor.sensor_type_parameter],
            component: getComponentBasedOnSensorType(
              sensor.sensor_type_parameter
            ),
          });
        }
      });
      setAvailableParams(params);
    }
  }, [sensorData, sensorStatus, selectedDevice]);

  if (!deviceInstallData) return null;
  if (sensorStatus !== "success") return <BigSpinner />;

  const getCustomerNameFromInstallLocation = (locationId) => {
    if (!boundaryData) return null;
    if (!boundaryData.result) return null;
    const findIndex = boundaryData.result.findIndex((b) => b.id === locationId);
    if (findIndex === -1) return null;
    if (!boundaryData.result[findIndex].customer) return null;
    return boundaryData.result[findIndex].customer.name;
  };

  return (
    <CCard>
      <CCardHeader className="bg-gradient-dark text-white font-weight-bold">
        {selectedDevice.name} - {selectedDevice.device.device_serial_number}
        &nbsp;
        <CBadge color="dark">
          <CIcon width={12} name="cil-layers" />
          &nbsp;{deviceInstallData.location_name}
        </CBadge>
        <br />
        &nbsp;
        {getCustomerNameFromInstallLocation(deviceInstallData.id_location) && (
          <CBadge color="dark">
            <CIcon width={12} content={cilBuilding} />
            &nbsp;
            {getCustomerNameFromInstallLocation(deviceInstallData.id_location)}
          </CBadge>
        )}
        <div className="card-header-actions">
          <Status id_device={id_device} />
          <Gps id_device={id_device} />
        </div>
      </CCardHeader>

      <CCardBody>
        <p
          className="thead text-lg-center font-weight-bold mb-2"
          style={{ textAlign: "center" }}
        >
          This Day Total
        </p>
        <div className="d-flex justify-content-center">
          {availableParams.map((_, index) =>
            index % 4 === 0
              ? [0, 1, 2, 3].map((i) => {
                  const paramIndex = index + i;
                  const param = availableParams[paramIndex];
                  return param ? (
                    <div
                      key={paramIndex}
                      sm="3"
                      md="3"
                      className="font-weight-bold text-center m-auto"
                    >
                      <h5>{param.type}</h5>
                      <h3 className="text-primary">
                        <strong>{param.component}</strong>
                      </h3>
                    </div>
                  ) : null;
                })
              : null
          )}
        </div>
      </CCardBody>

      <CCardFooter>
        <LiveSensorChart />
      </CCardFooter>
    </CCard>
  );
};

export default DeviceSummaryCardFactory;
