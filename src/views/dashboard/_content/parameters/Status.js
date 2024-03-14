import React, { useEffect, useState, useContext } from "react";
import { useGetDeviceMonitoring } from "../../../../api/dashboard";
import { CBadge } from "@coreui/react";
import moment from "moment";
import { ALERT_DIFF_STATUS_MIN } from "../../../../utils/constant";
import { TimeConfigProviderContext } from "../../_provider/TimeConfigProvider";

const Status = ({ id_device }) => {
  const { deviceMonitorTime } = useContext(TimeConfigProviderContext);
  const { data, status } = useGetDeviceMonitoring(
    id_device,
    "status",
    deviceMonitorTime.start,
    deviceMonitorTime.end
  );
  const [numbersStatus, setNumberStatus] = useState(0);
  useEffect(() => {
    if (status === "success") {
      if (!data) return setNumberStatus(0);
      if (!data.result) return setNumberStatus(0);

      const resultLength = data.result.length;

      if (resultLength === 0) return setNumberStatus(0);
      const lastData = data.result[resultLength - 1];

      // Sort logs berdasarkan created_on secara descending
      const sortedLogs = lastData.sensors_logs
        .sort((a, b) => {
          // Mengonversi tanggal dan waktu menjadi nilai yang dapat dibandingkan
          // Mengurutkan secara descending berdasarkan nilai-nilai waktu
          return (
            moment(b.created_on).valueOf() - moment(a.created_on).valueOf()
          );
        })
        .reverse();

      // Ambil data array pertama setelah logs diurutkan
      const firstLog = sortedLogs[0];

      const diffTime = Number(
        moment().diff(moment(firstLog.created_on), "minutes")
      );

      if (diffTime < ALERT_DIFF_STATUS_MIN) return setNumberStatus(1);
      return setNumberStatus(0);
    }
  });

  if (status !== "success") return "...";
  return (
    <>
      {numbersStatus === 1 ? (
        <CBadge color="success" className="float-right">
          Active
        </CBadge>
      ) : (
        <CBadge color="danger" className="float-right">
          Inactive
        </CBadge>
      )}
    </>
  );
};

export default Status;
