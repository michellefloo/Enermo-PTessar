import React, { useState, useEffect } from "react";
import { useGetDeviceList } from "../../../../api/device";
import DeviceCardFactory from "./DeviceCardFactory";
import { CRow, CCol } from "@coreui/react";

const DeviceCard = ({ devices }) => {
  const { data, status } = useGetDeviceList();
  const [deviceDataArr, setDeviceArr] = useState([]);

  useEffect(() => {
    if (status === "success") {
      const tempRqData = [...data.result];
      const tempDeviceArr = [];
      tempRqData.map((item1) => {
        const match = devices.find((item2) => item2.id_devices === item1.id);
        if (match) {
          tempDeviceArr.push(item1);
        }
      });
      if (tempDeviceArr.length > 0) {
        setDeviceArr([tempDeviceArr[1]]); // Hanya tambahkan data pertama
        // setDeviceArr(tempDeviceArr); // Munculkan semua data
      }
    }
  }, [status]);

  if (status !== "success" || deviceDataArr.length === 0) {
    return "...";
  }

  return (
    <CRow>
      {/* <CCol xs="2" md="2" xl="2">
        <DeviceCardNav/>
      </CCol> */}
      {deviceDataArr.map((device, index) =>
        device.is_main_panel === 1 ? (
          <CCol xs="6" md="6" xl="6" key={index + 1}>
            <DeviceCardFactory device={device} />
          </CCol>
        ) : null
      )}
    </CRow>
  );
};

export default DeviceCard;
