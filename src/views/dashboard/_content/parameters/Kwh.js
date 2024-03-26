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

  // useEffect(() => {
  //   if (status === "success") {
  //     if (!data || !data.result || data.result.length === 0) {
  //       setNumberKwh(null);
  //       return;
  //     }

  //     const lastData = data.result[data.result.length - 1];
  //     const firstData = data.result[0];

  //     const kwhCurrent = ((lastData.kwhAvg - firstData.kwhAvg) / 1000).toFixed(
  //       2
  //     );
  //     setNumberKwh(Math.abs(kwhCurrent));
  //   } else {
  //     setNumberKwh(null);
  //   }
  // }, [data, status]);

  useEffect(() => {
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
        setNumberKwh(0);
      }
    } else {
      setNumberKwh(0);
    }
  }, [data, status]);

  if (status !== "success") {
    return "...";
  }

  return <>{numbersKwh}</>;
};

export default Kwh;
