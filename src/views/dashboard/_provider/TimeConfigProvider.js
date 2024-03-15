import React, { createContext, useState } from "react";
import moment from "moment";

export const TimeConfigProviderContext = createContext();

const TimeConfigProvider = ({ children }) => {
  const [kwhAvgTime, setKwhAvgTime] = useState({
    start: moment().startOf("month").unix(),
    end: moment().unix(),
  });
  const [deviceMonitorTime, setDeviceMonitorTime] = useState({
    start: moment().startOf("day").unix(),
    end: moment().endOf("day").unix(),
  });
  const [fromStartToday, setFromStartToday] = useState({
    start: moment().startOf("day").unix(),
    end: moment().endOf("day").unix(),
  });
  const [locationMonitorTime, setlocationMonitorTime] = useState({
    start: moment().subtract(10, "minutes").unix(), // 10 menit terakhir
    end: moment().unix(),
  });

  // Menggunakan setTimeout untuk memperbarui waktu pemantauan perangkat dan waktu mulai hari setiap 5 menit (300000 milidetik)
  setTimeout(() => {
    // Memperbarui waktu pemantauan perangkat dari awal hari (00:00 AM) hingga akhir hari (23:59 PM)
    setDeviceMonitorTime({
      start: moment().startOf("day").unix(),
      end: moment().endOf("day").unix(),
    });
    // Memperbarui waktu pemantauan perangkat dari awal hari (00:00 AM) hingga akhir hari (23:59 PM)
    setFromStartToday({
      start: moment().startOf("day").unix(),
      end: moment().endOf("day").unix(),
    });
  }, 300000); // Mengatur waktu untuk 300000 milidetik (5 menit)

  return (
    <TimeConfigProviderContext.Provider
      value={{
        kwhAvgTime,
        setKwhAvgTime,
        deviceMonitorTime,
        setDeviceMonitorTime,
        fromStartToday,
        setFromStartToday,
        locationMonitorTime,
        setlocationMonitorTime,
      }}
    >
      {children}
    </TimeConfigProviderContext.Provider>
  );
};

export default TimeConfigProvider;
