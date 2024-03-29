import React, { useEffect, useState, useContext } from "react";
import { useGetDeviceMonitoring } from "../../../../api/dashboard";
import { useGetSensorByIddDeviceList } from "../../../../api/sensor";
import { TimeConfigProviderContext } from "../../_provider/TimeConfigProvider";
import BigSPinner from "../../../../components/ui/big-spinner/BigSpinner";
import moment from "moment";
import { CChartLine } from "@coreui/react-chartjs";
import { CRow, CCol } from "@coreui/react";
import {
  SENSOR_COLOR_PER_TYPE,
  DATE_ISO8601,
  EXCLUDED_CHART_PARAM,
} from "../../../../utils/constant";
import { getSensorInChartNaming } from "../../../../utils/helpers";

const LiveSensorChart = ({ id_device }) => {
  const { deviceMonitorTime } = useContext(TimeConfigProviderContext);
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
  const chartOptions = {
    // scales: {
    //   xAxes: [
    //     {
    //       ticks: {
    //         autoSkip: true,
    //         maxTicksLimit: 10, // Maksimum label sumbu X yang akan ditampilkan
    //       },
    //     },
    //   ],
    // },
    // title: {
    //   display: true,
    //   text: "Incoming Live Data", // Judul grafik
    // },
    legend: {
      display: true,
      position: "right", // Menentukan posisi legenda
      labels: {
        fontColor: "#555", // Warna label legenda
        fontSize: 10,
      },
    },
  };

  useEffect(() => {
    // console.log("Device Monitor Time (UNIX):", deviceMonitorTime);
    // console.log("Device Monitor Time (Current Time):", {
    //   start: moment.unix(deviceMonitorTime.start).format(),
    //   end: moment.unix(deviceMonitorTime.end).format(),
    // });
    const chartData = [];
    if (sensorStatus === "success") {
      if (!sensorData) return setChartData({});
      if (!sensorData.result) return setChartData({});
      sensorData.result.forEach((sensor) => {
        if (sensor.sensor_type_parameter in EXCLUDED_CHART_PARAM) return;
        // if (sensor.sensor_type_parameter !== "ptot") return; // hanya show data dan legend ptot saja
        chartData.push({
          param: sensor.sensor_type_parameter,
          label: getSensorInChartNaming(sensor.sensor_type_parameter),
          borderColor: SENSOR_COLOR_PER_TYPE[sensor.sensor_type_parameter],
          data: [0],
        });
      });
    }
    if (status === "success" && data && data.result) {
      if (!data) return setChartData({});
      if (!data.result) return setChartData({});

      const logs = data.result[0].sensors_logs;
      const filteredLogs = logs
        // Memeriksa apakah waktu log sama dengan waktu akhir pemantauan perangkat (dalam format UNIX) pada hari yang sama
        .filter((log) =>
          moment
            .unix(log.time_unix)
            .isSame(moment.unix(deviceMonitorTime.end), "day")
        )
        // Urutkan logs berdasarkan created on secara ASC
        .sort(
          (a, b) =>
            // Menggunakan fungsi moment untuk mengonversi waktu pembuatan log menjadi nilai waktu dalam milidetik
            // Kemudian logs diurutkan berdasarkan nilai waktu tersebut secara ascending (nilai waktu yang lebih rendah berada di bagian depan)
            moment(a.created_on).valueOf() - moment(b.created_on).valueOf()
        );
      if (!filteredLogs) return setChartData({});

      const valueByParam = {};
      const labels = [];
      filteredLogs.forEach((log) => {
        if (!(log.type in valueByParam)) {
          valueByParam[log.type] = [];
        }
        valueByParam[log.type].push({
          x: moment(log.created_on).format(DATE_ISO8601),
          y: log.value,
        });
        if (String(log.type) === String(filteredLogs[0].type)) {
          labels.push(moment(log.created_on).format("HH:mm"));
        }
      });
      chartData.forEach((log) => {
        log.data = valueByParam[log.param];
      });

      setChartLabels(labels);
      setChartData(chartData);
    }
  }, [data, status, sensorData, sensorStatus, deviceMonitorTime.end]);
  if (!chartData) return <BigSPinner />;
  return (
    <>
      <div
        className="thead text-lg-center font-weight-bold mb-2"
        style={{ textAlign: "center" }}
      >
        Incoming Live Data
      </div>
      <CRow>
        <CCol>
          <CChartLine
            labels={chartLabels}
            datasets={chartData}
            options={chartOptions}
          />
        </CCol>
      </CRow>
    </>
  );
};

export default LiveSensorChart;
