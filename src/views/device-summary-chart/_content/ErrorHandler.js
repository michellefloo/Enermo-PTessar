import { useEffect, useContext } from "react";
import { useDispatch } from "react-redux";
import { DeviceSummaryChartContext } from "../_provider/DeviceSummaryChartProvider";

const HistoryDeviceErrorHandler = () => {
  const dispatch = useDispatch();
  const { selectedDevice } = useContext(DeviceSummaryChartContext);
  useEffect(() => {
    if (selectedDevice.id === -1) {
      dispatch({
        type: "set",
        infoHeaderShow: true,
        theObjectNotFound: "device",
        objectNoFoundDataLink: "/device/list",
      });
    }
    if (selectedDevice.id > 0) {
      dispatch({
        type: "set",
        infoHeaderShow: false,
        theObjectNotFound: null,
        objectNoFoundDataLink: null,
      });
    }
  }, [selectedDevice, dispatch]);
  return null;
};
export default HistoryDeviceErrorHandler;
