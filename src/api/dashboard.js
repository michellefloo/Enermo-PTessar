import apiRoutes from "./routes";
import { useFecth } from "../utils/react-query";
import axios from "src/utils/axios";
import axiosNew from "axios";
import moment from "moment";
import { DATE_ISO8601 } from "src/utils/constant";
import {
  useGetSensorByIddDeviceList,
  useGetSensorTypeSelectList,
} from "../api/sensor";

export const useGetKwhAvg = (id_device, id_sensor, startUnix, endUnix) => {
  const { data: sensorData } = useGetSensorByIddDeviceList(id_device);

  const sensorId = sensorData?.result[0]?.id; // Mengambil id_sensor dari hasil panggilan useGetSensorByIddDeviceList

  const { data: data, status } = useFecth(
    apiRoutes.getKwhAvgNew,
    {
      id_device: String(id_device),
      id_sensor: String(sensorId), // Menggunakan variabel sensorId
      start_date: String(startUnix),
      end_date: String(endUnix),
    },
    {
      queryKey: ["kwhAvg", id_device, sensorId, startUnix, endUnix], // Menggunakan variabel sensorId
      select: (response) => {
        const { data } = response || {};
        if (!data) return null;
        return data || null;
      },
    }
  );

  return { data, status };
};

export const useGetDeviceMonitoring = (
  id_device,
  param,
  startUnix,
  endUnix
) => {
  const { data, status } = useFecth(
    apiRoutes.getDeviceMonitoringNew,
    {
      id: id_device,
      start_date: String(startUnix),
      end_date: String(endUnix),
      type: "ptot",
    },
    {
      queryKey: ["deviceMonitoring", id_device, startUnix, endUnix],
      select: (response) => {
        const { data } = response || {};
        if (!data) return [];
        return data;
      },
    }
  );

  return { data, status };
};

// export const useGetDeviceMonitoringByDate = (id_device, startUnix, endUnix) => {
//   const { data, status } = useFecth(
//     apiRoutes.getDeviceMonitoringNew,
//     {
//       id: id_device,
//       start_date: String(startUnix),
//       end_date: String(endUnix),
//       type: "ptot",
//     },
//     {
//       queryKey: ["deviceMonitoring", id_device, startUnix, endUnix],
//       refetchInterval: 300000,
//     }
//   );

//   // Menggunakan useState untuk menyimpan data cycle_count dan cycle_count_summarys
//   const [cycleCount, setCycleCount] = useState([]);
//   const [cycleCountSummarys, setCycleCountSummarys] = useState([]);

//   useEffect(() => {
//     if (status === "success" && data && data.result && data.result.length > 0) {
//       // Mengambil cycle_count dari respons API
//       const cycleCountData = data.result[0].cycle_count;
//       setCycleCount(cycleCountData);

//       // Mengambil cycle_count_summarys dari respons API
//       const cycleCountSummarysData = data.result[0].cycle_count_summarys;
//       setCycleCountSummarys(cycleCountSummarysData);
//     }
//   }, [data, status]);

//   return { data, status, cycleCount, cycleCountSummarys };
// };

// export const useGetDeviceMonitoringNotLive = (
//   id_device,
//   param,
//   startUnix,
//   endUnix
// ) => {
//   return useFecth(
//     apiRoutes.getDeviceMonitoringNew,
//     {
//       id: id_device,
//       start_date: String(startUnix),
//       end_date: String(endUnix),
//     },
//     {
//       queryKey: ["deviceMonitoring", id_device, startUnix, endUnix],
//       select: (response) => {
//         const { data } = response || {};
//         if (!data) return [];
//         const result = [];
//         data.result.map((item) => {
//           if (item.type === "ptot" && item.value > 1000) {
//             return;
//           }
//           if (item.type === "iavg" && item.value >= 100) {
//             return;
//           }
//           if (item.type === "edel" && item.value >= 888888888) {
//             return;
//           }
//           if (item.type === "vavg" && item.value >= 250) {
//             return;
//           }
//           if (item.type === "freq" && item.value >= 1000) {
//             return;
//           }
//           result.push(item);
//         });
//         data.result = result;
//         return data;
//       },
//     }
//   );
// };

// const getCycleDetail = async (data, sensor) => {
//   const param = "ptot";
//   const filteredSensor = sensor.filter(
//     (item) => item.sensor_type_parameter === param
//   )[0];
//   const filtered = data.filter((item) => item.type === param);
//   const resultLength = filtered.length;
//   let totalCycle = 0;
//   let lastIndexStartCycle = 0;
//   let mode = null;
//   let startTime = null;
//   const cycleDetailArr = [];
//   for (let i = 0; i < resultLength; i++) {
//     if (i === 0) continue;
//     const prev = filtered[lastIndexStartCycle];
//     const current = filtered[i];
//     if (lastIndexStartCycle === 0) {
//       if (current.value >= filteredSensor.max_measurement_cap) {
//         mode = "HIGH";
//         startTime = current.created_on;
//       } else {
//         mode = "LOW";
//       }
//     }
//     if (mode === "LOW" && lastIndexStartCycle > 0) {
//       if (
//         prev.value !== current.value &&
//         current.value >= filteredSensor.max_measurement_cap
//       ) {
//         mode = "HIGH";
//         startTime = current.created_on;
//       }
//     }
//     if (mode === "HIGH" && lastIndexStartCycle > 0) {
//       if (
//         prev.value !== current.value &&
//         current.value < filteredSensor.max_measurement_cap
//       ) {
//         mode = "LOW";
//         if (
//           moment(current.created_on).diff(moment(startTime), "minutes") >= 1
//         ) {
//           totalCycle++;
//           cycleDetailArr.push({
//             cycle: totalCycle,
//             start_time: moment(startTime).format(DATE_ISO8601),
//             end_time: moment(current.created_on).format(DATE_ISO8601),
//             duration: moment(current.created_on).diff(
//               moment(startTime),
//               "minutes"
//             ),
//             _checked: true,
//           });
//         }
//       }
//     }
//     lastIndexStartCycle = i;
//   }
//   return cycleDetailArr;
// };

// export const useGetDeviceMonitoringByDate = (id_device, startUnix, endUnix) => {
//   return useFecth(
//     apiRoutes.getDeviceMonitoringNew,
//     {
//       id: id_device,
//       start_date: String(startUnix),
//       end_date: String(endUnix),
//     },
//     {
//       // queryKey: ["deviceMonitoring", id_device, startUnix, endUnix],
//       select: async (response) => {
//         const { data } = response || {};
//         const result = {
//           summaryEachDay: [],
//           cycleDetailEachDay: [],
//         };
//         if (!data) return result;
//         if (!data.result) return result;
//         const rez = [];
//         data.result.map((item) => {
//           if (item.type === "ptot" && item.value > 1000) {
//             return;
//           }
//           if (item.type === "iavg" && item.value >= 100) {
//             return;
//           }
//           if (item.type === "edel" && item.value >= 888888888) {
//             return;
//           }
//           if (item.type === "vavg" && item.value >= 250) {
//             return;
//           }
//           if (item.type === "freq" && item.value >= 1000) {
//             return;
//           }
//           rez.push(item);
//         });
//         data.result = rez;
//         const fetchBoundary = await axiosNew.post(apiRoutes.getBoundary, null);
//         const fecthDeviceInstallation = await axiosNew.post(
//           apiRoutes.getDeviceInstalltion,
//           null
//         );
//         const fetchCustomer = await axiosNew.post(apiRoutes.getCustomer, null);
//         const fetchSensor = await axiosNew.post(apiRoutes.getSensor, {
//           id_device,
//         });
//         let id = 0;
//         let loopDate = moment.unix(startUnix).format("YYYYMMDD");
//         let endDate = moment.unix(endUnix).format("YYYYMMDD");
//         while (moment(endDate).diff(moment(loopDate), "days") >= 0) {
//           id = id + 1;
//           //get location (later better discuss with be for joining tables)
//           const installationPerDevice = [
//             ...fecthDeviceInstallation.data.result,
//           ].filter((item) => item.id_sensor === id_device);
//           let installationLocation = "-";
//           let installationCustomer = "-";
//           let lastIndexInstallation = null;
//           for (let i = 0; i < installationPerDevice.length; i++) {
//             const installationDate = moment(
//               installationPerDevice[i].installation_date
//             ).format("YYYYMMDD");
//             if (moment(loopDate).diff(installationDate) >= 0) {
//               lastIndexInstallation = i;
//             }
//           }
//           if (lastIndexInstallation !== null) {
//             installationLocation =
//               installationPerDevice[lastIndexInstallation].location_name;
//             const location = [...fetchBoundary.data.result].find(
//               (item) =>
//                 item.id ===
//                 installationPerDevice[lastIndexInstallation].id_location
//             );
//             if (location) {
//               installationCustomer = [...fetchCustomer.data.result].find(
//                 (item) => item.id === location.id_main_customer
//               );
//               installationCustomer = installationCustomer?.name;
//             }
//           }
//           //get history data
//           const filteredPerDaySensorData = [...data.result].filter(
//             (item) => moment(item.created_on).format("YYYYMMDD") === loopDate
//           );
//           const cycleDetail = await getCycleDetail(
//             filteredPerDaySensorData,
//             fetchSensor.data.result
//           );
//           const cycleTotal = cycleDetail.length;
//           result.cycleDetailEachDay.push({
//             id: id,
//             date: moment(loopDate).format("YYYY-MM-DD"),
//             cycle: cycleDetail,
//             location: installationLocation,
//             customer: installationCustomer,
//             _checked: true,
//           });
//           result.summaryEachDay.push({
//             id: id,
//             date: moment(loopDate).format("YYYY-MM-DD"),
//             cycle: cycleTotal,
//             // dataDetail: filteredPerDaySensorData,
//             location: installationLocation,
//             customer: installationCustomer,
//             _checked: true,
//           });
//           loopDate = moment(loopDate).add(1, "days").format("YYYYMMDD");
//         }
//         return result;
//       },
//     }
//   );
// };
