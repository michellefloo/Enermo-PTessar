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
      if (data.result.length === 0) return setNumberStatus(0);

      const lastData = data.result[data.result.length - 1];

      // Pastikan sensors_logs memiliki setidaknya satu entri
      if (!lastData.sensors_logs || lastData.sensors_logs.length === 0) {
        return setNumberStatus(0);
      }

      const diffTime = Number(
        moment().diff(moment(lastData.sensors_logs[0].created_on), "minutes")
      );
      console.log(diffTime);
      if (diffTime < ALERT_DIFF_STATUS_MIN) return setNumberStatus(1);
      return setNumberStatus(0);
    }
  }, [data, status]);

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
