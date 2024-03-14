import React, { useState, useEffect, Fragment } from "react";
import { useGetSensorByIddDeviceList } from "../../../../api/sensor";
import { useGetLastDeviceInstallByIddDeviceList } from "../../../../api/device-installation";
import { DEVICE_PARAMS_CONST } from "../../../../utils/constant";
import { useGetBoundaryList } from "../../../../api/boundary";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CRow,
  CCol,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBuilding } from "@coreui/icons";
import BigSpinner from "../../../../components/ui/big-spinner/BigSpinner";
import { Kwh, Status, Hum, Temp, CycleActivePower, Gps1 } from "../parameters";
import { LiveSensorChart } from "../charts";
import MonitoredUtilityList from "../monitored-utility/MonitoredUtilityList";

const DeviceCardFactory = ({ device }) => {
  const { data: deviceInstallData } = useGetLastDeviceInstallByIddDeviceList(
    device.id
  );
  const { data: sensorData, status: sensorStatus } =
    useGetSensorByIddDeviceList(device.id);
  const { data: boundaryData } = useGetBoundaryList({ withBoundary: true });
  const [availableParams, setAvailableParams] = useState([]);

  useEffect(() => {
    const getComponentBasedOnSensorType = (sensorType) => {
      switch (sensorType) {
        case "edel":
          return <Kwh id_device={device.id} param={sensorType} />;
        case "tem1":
          return <Temp id_device={device.id} param={sensorType} />;
        case "tem2":
          return <Temp id_device={device.id} param={sensorType} />;
        case "hum1":
          return <Hum id_device={device.id} param={sensorType} />;
        case "hum2":
          return <Hum id_device={device.id} param={sensorType} />;
        case "ptot":
          return <CycleActivePower device={device} param={sensorType} />;
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
  }, [sensorData, sensorStatus, device]);

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
        {device.device_desc} - {device.serial_number} &nbsp;
        <CBadge color="dark">
          <CIcon width={12} name="cil-layers" />
          &nbsp;{deviceInstallData.location_name}
        </CBadge>{" "}
        &nbsp;
        {getCustomerNameFromInstallLocation(deviceInstallData.id_location) && (
          <CBadge color="dark">
            <CIcon width={12} content={cilBuilding} />
            &nbsp;
            {getCustomerNameFromInstallLocation(deviceInstallData.id_location)}
          </CBadge>
        )}
        <div className="card-header-actions">
          <Status id_device={device.id} />
          <Gps1 id_device={device.id} />
        </div>
      </CCardHeader>
      <CCardBody>
        <div className="bg-info text-lg-center font-weight-bold">
          This Day Total
        </div>
        {availableParams.map(
          (_, index) =>
            index % 4 === 0 && (
              <Fragment key={index + 1}>
                <CRow>
                  <CCol sm="3" md="3" className="font-weight-bold text-center">
                    <h4>{availableParams[index]?.type}</h4>
                  </CCol>
                  <CCol sm="3" md="3" className="font-weight-bold text-center">
                    <h4>{availableParams[index + 1]?.type}</h4>
                  </CCol>
                  <CCol sm="3" md="3" className="font-weight-bold text-center">
                    <h4>{availableParams[index + 2]?.type}</h4>
                  </CCol>
                  <CCol sm="3" md="3" className="font-weight-bold text-center">
                    <h4>{availableParams[index + 3]?.type}</h4>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol sm="3" md="3" className="font-weight-bold text-center">
                    <h4>{availableParams[index]?.component}</h4>
                  </CCol>
                  <CCol sm="3" md="3" className="font-weight-bold text-center">
                    <h4>{availableParams[index + 1]?.component}</h4>
                  </CCol>
                  <CCol sm="3" md="3" className="font-weight-bold text-center">
                    <h4>{availableParams[index + 2]?.component}</h4>
                  </CCol>
                  <CCol sm="3" md="3" className="font-weight-bold text-center">
                    <h4>{availableParams[index + 3]?.component}</h4>
                  </CCol>
                </CRow>
              </Fragment>
            )
        )}
      </CCardBody>
      <CCardFooter>
        <LiveSensorChart id_device={device.id} />
      </CCardFooter>
      <CCardFooter>
        <MonitoredUtilityList id_device={device.id} />
      </CCardFooter>
    </CCard>
  );
};

export default DeviceCardFactory;
