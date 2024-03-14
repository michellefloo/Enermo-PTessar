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
    legend: {
      display: true,
      position: "left", // Menentukan posisi legenda
      labels: {
        fontColor: "#555", // Warna label legenda
        fontSize: 12,
      },
    },
  };

  useEffect(() => {
    // console.log("id" + id_device);
    // console.log("start" + deviceMonitorTime.start);
    // console.log("end" + deviceMonitorTime.end);
    const chartData = [];
    if (sensorStatus === "success") {
      if (!sensorData) return setChartData({});
      if (!sensorData.result) return setChartData({});
      sensorData.result.forEach((sensor) => {
        if (sensor.sensor_type_parameter in EXCLUDED_CHART_PARAM) return;
        if (sensor.sensor_type_parameter !== "ptot") return; // hanya ambil data ptot saja
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
      const filteredLogs = logs.filter((log) =>
        moment
          .unix(log.time_unix)
          .isSame(moment.unix(deviceMonitorTime.end), "day")
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
          labels.push(moment(log.created_on).format("HH:mm:ss"));
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
      <div className="bg-info text-lg-center font-weight-bold mb-3">
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

// import React, { useEffect, useState, useContext } from "react";
// import { useGetDeviceMonitoring } from "../../../../api/dashboard";
// import { useGetSensorByIddDeviceList } from "../../../../api/sensor";
// import { TimeConfigProviderContext } from "../../_provider/TimeConfigProvider";
// import BigSPinner from "../../../../components/ui/big-spinner/BigSpinner";
// import moment from "moment";
// import { CChartLine } from "@coreui/react-chartjs";
// import { CRow, CCol } from "@coreui/react";
// import {
//   SENSOR_COLOR_PER_TYPE,
//   DATE_ISO8601,
//   EXCLUDED_CHART_PARAM,
// } from "../../../../utils/constant";
// import { getSensorInChartNaming } from "../../../../utils/helpers";

// const LiveSensorChart = ({ id_device }) => {
//   const { deviceMonitorTime } = useContext(TimeConfigProviderContext);
//   const { data: sensorData, status: sensorStatus } =
//     useGetSensorByIddDeviceList(id_device);
//   const { data, status } = useGetDeviceMonitoring(
//     id_device,
//     null,
//     deviceMonitorTime.start,
//     deviceMonitorTime.end
//   );
//   const [chartData, setChartData] = useState(null);
//   const [chartLabels, setChartLabels] = useState(null);

//   useEffect(() => {
//     if (status === "success" && data && data.result) {
//       const logs = data.result[0].sensors_logs;
//       const filteredLogs = logs.filter((log) =>
//         moment
//           .unix(log.time_unix)
//           .isSame(moment.unix(deviceMonitorTime.end), "day")
//       );

//       const valueByParam = {};
//       const labels = [];
//       const newData = [];

//       filteredLogs.forEach((log) => {
//         if (!valueByParam[log.type]) {
//           valueByParam[log.type] = [];
//         }
//         valueByParam[log.type].push({
//           x: moment(log.created_on).format(DATE_ISO8601),
//           y: log.value,
//         });
//         if (!labels.includes(moment(log.created_on).format("MM-DD HH:mm:ss"))) {
//           labels.push(moment(log.created_on).format("MM-DD HH:mm:ss"));
//         }
//       });

//       Object.entries(valueByParam).forEach(([type, values]) => {
//         newData.push({
//           param: type,
//           label: getSensorInChartNaming(type),
//           borderColor: SENSOR_COLOR_PER_TYPE[type],
//           data: values,
//         });
//       });

//       setChartData(newData);
//       setChartLabels(labels);
//     }
//   }, [data, status, deviceMonitorTime.end]);

//   if (!chartData) return <BigSPinner />;
//   return (
//     <>
//       <CRow>
//         <CCol>
//           <CChartLine labels={chartLabels} datasets={chartData} />
//         </CCol>
//       </CRow>
//       <div className="bg-info text-lg-center font-weight-bold">
//         Incoming Live Data
//       </div>
//     </>
//   );
// };

// export default LiveSensorChart;
