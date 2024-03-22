import React, { useEffect, useState, useContext } from "react";
import { useGetDeviceMonitoring } from "../../../../api/dashboard";
import { useGetSensorByIddDeviceList } from "src/api/sensor";
import { TimeConfigProviderContext } from "../../_provider/TimeConfigProvider";
import { useDispatch } from "react-redux";

const CycleActivePower = ({ device, param }) => {
  const dispatch = useDispatch();
  const { fromStartToday } = useContext(TimeConfigProviderContext);
  const { data: sensorData, status: sensorDataStatus } =
    useGetSensorByIddDeviceList(device.id);
  const { data, status } = useGetDeviceMonitoring(
    device.id,
    param,
    fromStartToday.start,
    fromStartToday.end
  );
  const [numberOfCycle, setNumberEdelCycle] = useState(0);
  const [cycleDetail, setCycleDetail] = useState([]);

  useEffect(() => {
    if (status === "success" && sensorDataStatus === "success") {
      if (!data || !data.result || !sensorData || !sensorData.result)
        return setNumberEdelCycle("-");

      // Filter data untuk mendapatkan cycle_count dan cycle_count_summarys
      const cycleCountData = data.result[0].cycle_count;
      const cycleCountSummaryData = data.result[0].cycle_count_summarys;

      // Hitung jumlah total siklus dari semua objek dalam array cycleCountData dan menyimpannya dalam variabel totalCycle.
      // Menggunakan metode reduce() untuk menjumlahkan nilai dari properti cycle dari setiap objek dalam array cycle_countData
      // const totalCycle = cycleCountData.reduce(
      //   (total, item) => total + item.cycle,
      //   0
      // );

      const totalCycle = cycleCountSummaryData[0].cycle;

      // Simpan detail siklus per hari
      const cycleDetailArr = [];
      let i = 1;
      cycleCountData.forEach((cycle) => {
        cycleDetailArr.push({
          cycle: i,
          start_time: cycle.start_time,
          end_time: cycle.end_time,
          duration: cycle.duration,
        });
        i++;
      });

      setNumberEdelCycle(totalCycle);
      setCycleDetail(cycleDetailArr);
    }
  }, [data, status, sensorData, sensorDataStatus]);

  if (status !== "success") return "...";

  return (
    <div
      style={{
        cursor: "pointer",
      }}
      onClick={() => {
        dispatch({
          type: "CALL_MODAL",
          modalName: "cycleDetailModal",
          initialValues: {
            device_name: device.device_desc,
            detail: cycleDetail,
          },
        });
      }}
    >
      {numberOfCycle}
    </div>
  );
};

export default CycleActivePower;
