import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetDeviceList } from "../../../api/device";
import { toast } from "react-toastify";

const DeviceSummaryTableErrorHandler = () => {
  const dispatch = useDispatch();
  const { status: rqStatus, error: rqError } = useGetDeviceList();
  useEffect(() => {
    if (rqStatus === "error") {
      const { message } = rqError;
      toast.error(message);
      dispatch({ type: "set", infoHeaderShow: true });
    }
    if (rqStatus === "success") {
      dispatch({ type: "set", infoHeaderShow: false });
    }
  }, [rqStatus, rqError, dispatch]);

  return null;
};

export default DeviceSummaryTableErrorHandler;
