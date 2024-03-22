import apiRoutes from "./routes";
import { useFecth } from "../utils/react-query";
import axios from "src/utils/axios";
import axiosNew from "axios";
import moment from "moment";
import { DATE_ISO8601 } from "src/utils/constant";
import { useGetSensorByIddDeviceList } from "../api/sensor";

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

export const useGetLocationMonitoring = (
  id_device,
  startUnix,
  endUnix,
  types
) => {
  const { data, status } = useFecth(
    apiRoutes.getLocationMonitoring,
    {
      id: String(id_device),
      start_date: String(startUnix),
      end_date: String(endUnix),
      types: ["londata", "latdata"],
    },
    {
      queryKey: ["locationMonitoring", id_device, startUnix, endUnix, types],
      select: (response) => {
        const { data } = response || {};
        if (!data) return null;
        return data || null;
      },
    }
  );

  return { data, status };
};

export const useGetDeviceMonitoringNotLive = (
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
