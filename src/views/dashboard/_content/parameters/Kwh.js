import React, { useEffect, useState, useContext } from "react";
import { useGetKwhAvg } from "../../../../api/dashboard";
import { TimeConfigProviderContext } from "../../_provider/TimeConfigProvider";

const Kwh = ({ id_device, id_sensor }) => {
  const { fromStartToday } = useContext(TimeConfigProviderContext);
  const { data, status } = useGetKwhAvg(
    id_device,
    id_sensor,
    fromStartToday.start,
    fromStartToday.end
  );
  const [numbersKwh, setNumberKwh] = useState(0);

  useEffect(() => {
    // console.log("Data:", data);
    // console.log("Status:", status);

    if (status === "success") {
      // Check apakah data.result ada atau tidak
      if (data && data.result) {
        // Hitung jumlah kwhAvg dlm array data
        const totalKwhAvg = data.result.reduce(
          (total, item) => total + item.kwhAvg,
          0
        );

        // Menggunakan toFixed(2) untuk mengambil 2 angka desimal
        setNumberKwh(totalKwhAvg.toFixed(2));
      } else {
        // console.log("Data result is empty.");
        setNumberKwh(0);
      }
    } else {
      // console.log("Data fetching failed.");
      setNumberKwh(0);
    }
  }, [data, status]);

  if (status !== "success") {
    // console.log("Waiting for data...");
    return "...";
  }

  return <>{numbersKwh}</>;
};

export default Kwh;
