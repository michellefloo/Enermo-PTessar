import React, { Fragment, useState, useEffect } from "react";
import { CCol, CWidgetIcon, CSpinner } from "@coreui/react";
import { cilBolt } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useGetKwhAvg } from "../../../../../api/dashboard";
import { useGetDeviceList } from "../../../../../api/device";
import { useGetSensorList } from "../../../../../api/sensor";
import moment from "moment";

const GetKwhAvg = (id_device, sensor) => {
  const { data, status } = useGetKwhAvg(
    id_device,
    sensor.id,
    moment().startOf("month").unix(),
    moment().endOf("month").unix()
  );
  const [kwh, setKwh] = useState(null);
  const [isTotalingDone, setIsTotalingDone] = useState(false);
  useEffect(() => {
    if (status === "success") {
      if (!data) return;
      if (!data.result) return;
      const resultLength = data.result.length;
      if (resultLength === 0) return;
      let totalkwh = null;
      let counter = 0;
      data.result.forEach((d) => {
        totalkwh += Number(d.kwhAvg);
        counter += 1;
      });
      setKwh(Number(totalkwh / 1000).toFixed(2));
      if (counter >= resultLength) {
        setIsTotalingDone(true);
      }
    }
  }, [data, status]);
  if (status === "success" && kwh && isTotalingDone)
    return { status: "success", data: { result: kwh } };
};

const RealKwhThisMonth = () => {
  const { data } = useGetDeviceList();
  const { data: sensorData, status: sensorStatus } = useGetSensorList();
  const [allRqStatus, setAllRqStatus] = useState("loading");
  const kwhAvgArr = [];
  if (sensorStatus !== "success" || !data.result) {
    return (
      <Fragment>
        <br />
        <CCol xs="12" sm="6" lg="4">
          <CSpinner
            className="spinner spinner--spacer-bottom"
            color="primary"
            variant="grow"
          />
        </CCol>
      </Fragment>
    );
  }
  if (allRqStatus === "loading") {
    data.result.map((device, index) => {
      if (device.is_main_panel === 1) {
        kwhAvgArr.push(
          GetKwhAvg(
            device.id,
            sensorData.result.find(
              (s) => s.id_device === device.id && s.sensor_type === "edel"
            )
          )
        );
      }
    });
  }
  let counter = null;
  kwhAvgArr.forEach((item) => {
    if (!item) return;
    if (item) {
      counter += 1;
    }
  });
  if (!(counter >= kwhAvgArr.length))
    return (
      <Fragment>
        <br />
        <CCol xs="12" sm="6" lg="4">
          <CSpinner
            className="spinner spinner--spacer-bottom"
            color="primary"
            variant="grow"
          />
        </CCol>
      </Fragment>
    );
  const getAllTotal = () => {
    let total = 0;
    kwhAvgArr.forEach((item) => {
      if (!item) return;
      if (item) {
        total += Number(item.data.result);
      }
    });
    return total.toFixed(2);
  };
  if (counter >= kwhAvgArr.length)
    return (
      <Fragment>
        <CWidgetIcon
          color="primary"
          iconPadding={false}
          header={getAllTotal().toLocaleString()}
          text="REAL KWH THIS MONTH"
          className="text-uppercase font-weight-bold"
        >
          <CIcon width={24} content={cilBolt} />
        </CWidgetIcon>
      </Fragment>
    );
};

export default RealKwhThisMonth;
