import React, { useEffect, useState, useContext } from "react";
import { useGetDeviceMonitoring } from "../../../api/dashboard";
import { useGetSensorByIddDeviceList } from "../../../api/sensor";
import BigSPinner from "../../../components/ui/big-spinner/BigSpinner";
import moment from "moment";
import { CChartLine } from "@coreui/react-chartjs";
import { CRow, CCol } from "@coreui/react";
import {
  SENSOR_COLOR_PER_TYPE,
  DATE_ISO8601,
  EXCLUDED_CHART_PARAM,
} from "../../../utils/constant";
import { getSensorInChartNaming } from "../../../utils/helpers";
import { DeviceSummaryChartContext } from "../_provider/DeviceSummaryChartProvider";
import { TimeConfigProviderContext } from "src/views/dashboard/_provider/TimeConfigProvider";

const LiveSensorChart = () => {
  const { deviceMonitorTime } = useContext(TimeConfigProviderContext);
  const { selectedDevice } = useContext(DeviceSummaryChartContext);
  const id_device = selectedDevice.id;
  const { data: sensorData, status: sensorStatus } =
    useGetSensorByIddDeviceList(id_device);
  const { data, status } = useGetDeviceMonitoring(
    id_device,
    null,
    deviceMonitorTime.start,
    deviceMonitorTime.end
  );
  const [chartData, setChartData] = useState(null);
  const [chartLabels, setChartLabels] = useState(null);
  useEffect(() => {
    const chartData = [];
    if (sensorStatus === "success") {
      if (!sensorData) return setChartData({});
      if (!sensorData.result) return setChartData({});
      sensorData.result.forEach((sensor) => {
        if (sensor.sensor_type_parameter in EXCLUDED_CHART_PARAM) return;
        chartData.push({
          param: sensor.sensor_type_parameter,
          label: getSensorInChartNaming(sensor.sensor_type_parameter),
          borderColor: SENSOR_COLOR_PER_TYPE[sensor.sensor_type_parameter],
          data: [0],
        });
      });
    }
    if (status === "success") {
      if (!data) return setChartData({});
      if (!data.result) return setChartData({});

      const filtered = data.result[0].sensors_logs;

      // Sort filtered by created_on ascending
      filtered.sort(
        (a, b) =>
          moment(a.created_on).valueOf() - moment(b.created_on).valueOf()
      );

      if (!filtered) return setChartData({});
      const valueByParam = {};
      const labels = [];
      filtered.forEach((item) => {
        if (!(item.type in valueByParam)) {
          valueByParam[item.type] = [];
        }
        valueByParam[item.type].push({
          x: moment(item.created_on).format(DATE_ISO8601),
          y: item.value,
        });
        if (String(item.type) === String(filtered[0].type)) {
          labels.push(moment(item.created_on).format("HH:mm:ss"));
        }
      });
      chartData.forEach((item) => {
        item.data = valueByParam[item.param];
      });
      setChartLabels(labels);
      setChartData(chartData);
    }
  }, [data, status, sensorData, sensorStatus, deviceMonitorTime.end]);
  if (!chartData) return <BigSPinner />;
  return (
    <>
      <CRow>
        <CCol className="text-center d-blok">
          <i>Klik legenda untuk menampilkan filter</i>
          <CChartLine labels={chartLabels} datasets={chartData} />
        </CCol>
      </CRow>
    </>
  );
};

export default LiveSensorChart;
