import React from "react";
import DeviceHistoryChartProvider from "./_provider/DeviceHistoryChartProvider";
import DeviceSummaryChart from "./DeviceSummaryChart";

const Dashboard = () => {
  return (
    <DeviceHistoryChartProvider>
      <DeviceSummaryChart />
    </DeviceHistoryChartProvider>
  );
};

export default Dashboard;
